// Image metadata strip/write core (JPEG, PNG, WebP). Pure functions, runs in the browser.

/* ===== Pure metadata-stripping core (no DOM) — tested in Node ===== */
const LATIN = (typeof TextDecoder !== 'undefined') ? new TextDecoder('latin1') : null;
function ascii(u8, off, n){ let s=''; for(let i=0;i<n;i++) s += String.fromCharCode(u8[off+i]); return s; }
function nullStr(u8, off, max){ let s=''; for(let i=0;i<max && u8[off+i];i++) s += String.fromCharCode(u8[off+i]); return s; }
function preview(u8, off, n){ const s = nullStr(u8, off, Math.min(n, 48)); return s.replace(/[\x00-\x1f\x7f]/g,' ').trim().slice(0,48); }

/* ---------- JPEG: drop all APPn (except ICC profile) + COM, keep image data ---------- */
function describeApp(u8, off, n, marker){
  const head = ascii(u8, off, Math.min(n, 24));
  if (head.indexOf('Exif\0\0') === 0) return {kind:'EXIF', label:'EXIF ডেটা (সফটওয়্যার/ডিভাইস তথ্য)'};
  if (head.indexOf('http://ns.adobe.com/xap/') === 0) return {kind:'XMP', label:'XMP মেটাডাটা (AI তথ্য থাকতে পারে)'};
  if (/JUMB|JUMD/.test(head.slice(0,12))) return {kind:'C2PA', label:'C2PA Content Credentials — AI উৎসের প্রমাণ ⚠️'};
  if (head.indexOf('Photoshop 3.0') === 0) return {kind:'IPTC', label:'Photoshop / IPTC মেটাডাটা'};
  if (head.indexOf('JFIF') === 0) return {kind:'JFIF', label:'JFIF হেডার'};
  if (head.indexOf('Adobe') === 0) return {kind:'ADOBE', label:'Adobe APP14 হেডার'};
  if (head.indexOf('ICC_PROFILE') === 0) return {kind:'ICC', label:'ICC কালার প্রোফাইল'};
  return {kind:'APP'+(marker-0xE0), label:'APP'+(marker-0xE0)+' সেগমেন্ট'};
}
function stripJpeg(buf){
  const u8 = new Uint8Array(buf); const dv = new DataView(buf); const len = u8.length;
  if (len < 4 || dv.getUint16(0) !== 0xFFD8) throw new Error('bad-jpeg');
  const parts = [u8.slice(0,2)]; const removed = []; let iccKept = false;
  let off = 2;
  while (off + 4 <= len){
    if (u8[off] !== 0xFF) throw new Error('bad-marker');
    const m = u8[off+1];
    if (m === 0xD9){ parts.push(u8.slice(off, off+2)); off += 2; break; }           // EOI
    if (m === 0xD8 || m === 0x01 || (m >= 0xD0 && m <= 0xD7)){ parts.push(u8.slice(off, off+2)); off += 2; continue; }
    const segLen = dv.getUint16(off+2); const dOff = off+4; const dLen = segLen-2;
    if (m === 0xDA){ parts.push(u8.slice(off)); off = len; break; }                 // SOS: rest verbatim
    if (m >= 0xE0 && m <= 0xEF){
      const info = describeApp(u8, dOff, dLen, m);
      if (m === 0xE2 && info.kind === 'ICC'){ parts.push(u8.slice(off, off+2+segLen)); iccKept = true; }
      else removed.push(info);
    } else if (m === 0xFE){
      removed.push({kind:'COM', label:'COM কমেন্ট: "'+preview(u8,dOff,dLen)+'"'});
    } else {
      parts.push(u8.slice(off, off+2+segLen));
    }
    off += 2 + segLen;
  }
  const total = parts.reduce((a,p)=>a+p.length,0);
  const out = new Uint8Array(total); let p = 0;
  for (const s of parts){ out.set(s, p); p += s.length; }
  return {bytes: out, removed, iccKept};
}

/* ---------- PNG: keep critical + color/display chunks, drop metadata chunks ---------- */
const PNG_KEEP = new Set(['IHDR','PLTE','IDAT','IEND','tRNS','iCCP','sRGB','gAMA','cHRM','pHYs','bKGD','acTL','fcTL','fdAT']);
function describePngChunk(type, data){
  if (type === 'tEXt' || type === 'zTXt'){
    const kw = nullStr(data, 0, data.length);
    return {kind:type, label: type+' — "'+kw.slice(0,40)+'"'};
  }
  if (type === 'iTXt'){
    const kw = nullStr(data, 0, data.length);
    const isC2PA = /c2pa/i.test(kw);
    return {kind:type, label: 'iTXt — "'+kw.slice(0,40)+'"' + (isC2PA ? ' (C2PA! ⚠️)' : '')};
  }
  if (type === 'eXIf') return {kind:'eXIf', label:'EXIF ডেটা (PNG)'};
  if (type === 'jumb') return {kind:'jumb', label:'JUMBF — C2PA Content Credentials ⚠️'};
  return {kind:type, label: type+' চাংক'};
}
function stripPng(buf){
  const u8 = new Uint8Array(buf);
  const sig = [137,80,78,71,13,10,26,10];
  for (let i=0;i<8;i++) if (u8[i] !== sig[i]) throw new Error('bad-png');
  const parts = [u8.slice(0,8)]; const removed = [];
  let off = 8;
  while (off + 12 <= u8.length){
    const dLen = (u8[off]<<24)|(u8[off+1]<<16)|(u8[off+2]<<8)|u8[off+3];
    const type = ascii(u8, off+4, 4);
    const end = off + 12 + dLen;
    if (end > u8.length) throw new Error('bad-chunk');
    const critical = type[0] === type[0].toUpperCase();
    if (PNG_KEEP.has(type) || critical){
      parts.push(u8.slice(off, end));
    } else {
      removed.push(describePngChunk(type, u8.slice(off+8, off+8+dLen)));
    }
    off = end;
    if (type === 'IEND') break;
  }
  const total = parts.reduce((a,p)=>a+p.length,0);
  const out = new Uint8Array(total); let p = 0;
  for (const s of parts){ out.set(s, p); p += s.length; }
  return {bytes: out, removed};
}

/* ---------- WebP: drop EXIF/XMP chunks, fix VP8X flags ---------- */
function stripWebp(buf){
  const u8 = new Uint8Array(buf); const dv = new DataView(buf);
  if (u8.length < 12 || ascii(u8,0,4) !== 'RIFF' || ascii(u8,8,4) !== 'WEBP') throw new Error('bad-webp');
  const removed = []; const kept = [];
  let off = 12;
  while (off + 8 <= u8.length){
    const fourcc = ascii(u8, off, 4);
    const size = dv.getUint32(off+4, true);
    const data = u8.slice(off+8, off+8+size);
    if (fourcc === 'EXIF'){ removed.push({kind:'EXIF', label:'EXIF ডেটা'}); }
    else if (fourcc === 'XMP '){ removed.push({kind:'XMP', label:'XMP মেটাডাটা (AI তথ্য থাকতে পারে)'}); }
    else kept.push({fourcc, data});
    off += 8 + size + (size & 1);
  }
  if (!kept.length) throw new Error('empty-webp');
  for (const c of kept){
    if (c.fourcc === 'VP8X' && c.data.length >= 1 && removed.length){
      c.data = c.data.slice(); c.data[0] = c.data[0] & ~0x0C;   // EXIF(0x08)+XMP(0x04) ফ্ল্যাগ ক্লিয়ার
    }
  }
  return {bytes: buildWebp(kept), removed};
}

/* ---------- metadata WRITE: CRC32 ---------- */
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++){ let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; } return t; })();
function crc32(u8){ let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }

/* ---------- shared helpers ---------- */
function u8of(buf){ return (buf instanceof Uint8Array) ? buf : new Uint8Array(buf); }
function concatParts(parts){
  const total = parts.reduce((a,p)=>a+p.length,0);
  const out = new Uint8Array(total); let p = 0;
  for (const s of parts){ out.set(s, p); p += s.length; }
  return out;
}
function latin1bytes(s){ const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xFF; return b; }
function isLatin1(s){ for (let i = 0; i < s.length; i++){ const c = s.charCodeAt(i); if (c === 0 || c > 0xFF) return false; } return true; }
function xmlEsc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function buildWebp(chunks){
  const enc = new TextEncoder();
  const parts = [];
  for (const c of chunks){
    const h = new Uint8Array(8);
    h.set(enc.encode(c.fourcc), 0);
    new DataView(h.buffer).setUint32(4, c.data.length, true);
    parts.push(h, c.data);
    if (c.data.length & 1) parts.push(new Uint8Array([0]));
  }
  const body = concatParts(parts);
  const out = new Uint8Array(12 + body.length);
  out.set(enc.encode('RIFF'), 0);
  new DataView(out.buffer).setUint32(4, 4 + body.length, true);
  out.set(enc.encode('WEBP'), 8);
  out.set(body, 12);
  return out;
}
function parseWebpChunks(u8){
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  if (u8.length < 12 || ascii(u8,0,4) !== 'RIFF' || ascii(u8,8,4) !== 'WEBP') throw new Error('bad-webp');
  const chunks = []; let off = 12;
  while (off + 8 <= u8.length){
    const fourcc = ascii(u8, off, 4);
    const size = dv.getUint32(off+4, true);
    chunks.push({fourcc, data: u8.slice(off+8, off+8+size)});
    off += 8 + size + (size & 1);
  }
  return chunks;
}

/* ---------- XMP packet (JPEG APP1 / WebP XMP chunk) ---------- */
function buildXmp(f){
  const li = arr => arr.map(k => '<rdf:li>' + xmlEsc(k) + '</rdf:li>').join('');
  const alt = v => '<rdf:Alt><rdf:li xml:lang="x-default">' + xmlEsc(v) + '</rdf:li></rdf:Alt>';
  let s = '<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>\n<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Learn With Shohagh Metadata Cleaner">\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmp="http://ns.adobe.com/xap/1.0/">\n';
  if (f.title) s += '<dc:title>' + alt(f.title) + '</dc:title>\n';
  if (f.description) s += '<dc:description>' + alt(f.description) + '</dc:description>\n';
  if (f.author) s += '<dc:creator><rdf:Seq><rdf:li>' + xmlEsc(f.author) + '</rdf:li></rdf:Seq></dc:creator>\n';
  if (f.copyright) s += '<dc:rights>' + alt(f.copyright) + '</dc:rights>\n';
  if (f.keywords && f.keywords.length) s += '<dc:subject><rdf:Bag>' + li(f.keywords) + '</rdf:Bag></dc:subject>\n';
  if (f.software) s += '<xmp:CreatorTool>' + xmlEsc(f.software) + '</xmp:CreatorTool>\n';
  s += '</rdf:Description>\n</rdf:RDF>\n</x:xmpmeta>\n<?xpacket end="w"?>';
  return new TextEncoder().encode(s);
}

/* ---------- minimal TIFF/EXIF (JPEG APP1 / WebP EXIF chunk / PNG eXIf) ---------- */
function buildTiff(f){
  const entries = [];
  const A = s => { const b = new TextEncoder().encode(s); const o = new Uint8Array(b.length+1); o.set(b); return o; };
  const W = s => { const o = new Uint8Array(s.length*2+2); for (let i = 0; i < s.length; i++){ o[i*2] = s.charCodeAt(i) & 0xFF; o[i*2+1] = (s.charCodeAt(i) >> 8) & 0xFF; } return o; };
  if (f.title) entries.push([0x010E, 2, A(f.title)]);                    // ImageDescription
  if (f.author) entries.push([0x013B, 2, A(f.author)]);                   // Artist
  if (f.copyright) entries.push([0x8298, 2, A(f.copyright)]);            // Copyright
  if (f.software) entries.push([0x0131, 2, A(f.software)]);               // Software
  if (f.title) entries.push([0x9C9B, 1, W(f.title)]);                     // XPTitle (UTF-16, Windows)
  if (f.description) entries.push([0x9C9C, 1, W(f.description)]);        // XPComment
  if (f.author) entries.push([0x9C9D, 1, W(f.author)]);                   // XPAuthor
  if (f.keywords && f.keywords.length) entries.push([0x9C9E, 1, W(f.keywords.join('; '))]); // XPKeywords
  const n = entries.length;
  const dataStart = 8 + 2 + 12*n + 4;
  let total = dataStart;
  const sized = entries.map(([tag, type, bytes]) => ({tag, type, count: bytes.length, bytes, off: 0}));
  for (const e of sized){ e.off = total; total += e.bytes.length; }
  const out = new Uint8Array(total);
  const dv = new DataView(out.buffer);
  out[0] = 0x49; out[1] = 0x49; dv.setUint16(2, 42, true); dv.setUint32(4, 8, true);
  dv.setUint16(8, n, true);
  let p = 10;
  for (const e of sized){ dv.setUint16(p, e.tag, true); dv.setUint16(p+2, e.type, true); dv.setUint32(p+4, e.count, true); dv.setUint32(p+8, e.off, true); p += 12; }
  dv.setUint32(p, 0, true);
  for (const e of sized) out.set(e.bytes, e.off);
  return out;
}

/* ---------- PNG: tEXt (latin1) / iTXt (utf-8) ---------- */
function pngTextChunk(keyword, text){
  const enc = new TextEncoder();
  let type, body;
  if (isLatin1(keyword) && isLatin1(text)){
    type = 'tEXt';
    const kb = latin1bytes(keyword), tb = latin1bytes(text);
    body = new Uint8Array(kb.length + 1 + tb.length);
    body.set(kb, 0); body.set(tb, kb.length + 1);
  } else {
    type = 'iTXt';
    const kb = enc.encode(keyword), tb = enc.encode(text);
    body = new Uint8Array(kb.length + 5 + tb.length);
    body.set(kb, 0);
    body[kb.length+1] = 0; body[kb.length+2] = 0;   // compression flag + method = uncompressed
    body.set(tb, kb.length + 5);                    // lang="" + translated keyword="" (zeros)
  }
  const t = enc.encode(type);
  const out = new Uint8Array(12 + body.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, body.length);
  out.set(t, 4); out.set(body, 8);
  dv.setUint32(8 + body.length, crc32(out.slice(4, 8 + body.length)));
  return out;
}
function addMetadataPng(buf, f){
  const u8 = u8of(buf);
  const sig = [137,80,78,71,13,10,26,10];
  for (let i = 0; i < 8; i++) if (u8[i] !== sig[i]) throw new Error('bad-png');
  const list = [
    ['Title', f.title], ['Description', f.description], ['Author', f.author],
    ['Copyright', f.copyright], ['Software', f.software],
    ['Keywords', (f.keywords && f.keywords.length) ? f.keywords.join(', ') : '']
  ].filter(([, v]) => v);
  const fresh = list.map(([k, v]) => pngTextChunk(k, v));
  const parts = [u8.slice(0, 8)];
  let off = 8;
  while (off + 12 <= u8.length){
    const dLen = (u8[off]<<24)|(u8[off+1]<<16)|(u8[off+2]<<8)|u8[off+3];
    const type = ascii(u8, off+4, 4);
    const end = off + 12 + dLen;
    if (type === 'IEND') for (const c of fresh) parts.push(c);
    parts.push(u8.slice(off, end));
    off = end;
    if (type === 'IEND') break;
  }
  return concatParts(parts);
}

/* ---------- JPEG: APP1 EXIF + APP1 XMP after SOI ---------- */
function jpegSeg(marker, payload){
  const out = new Uint8Array(4 + payload.length);
  out[0] = 0xFF; out[1] = marker;
  new DataView(out.buffer).setUint16(2, payload.length + 2);
  out.set(payload, 4);
  return out;
}
function addMetadataJpeg(buf, f){
  const u8 = u8of(buf);
  if (u8.length < 2 || u8[0] !== 0xFF || u8[1] !== 0xD8) throw new Error('bad-jpeg');
  const enc = new TextEncoder();
  const parts = [u8.slice(0, 2)];
  const tiff = buildTiff(f);
  const exifPayload = new Uint8Array(6 + tiff.length);
  exifPayload.set(enc.encode('Exif\0\0'), 0); exifPayload.set(tiff, 6);
  const xmpHead = enc.encode('http://ns.adobe.com/xap/1.0/\0');
  const xmp = buildXmp(f);
  const xmpPayload = new Uint8Array(xmpHead.length + xmp.length);
  xmpPayload.set(xmpHead, 0); xmpPayload.set(xmp, xmpHead.length);
  if (exifPayload.length + 2 <= 65535) parts.push(jpegSeg(0xE1, exifPayload));
  if (xmpPayload.length + 2 <= 65535) parts.push(jpegSeg(0xE1, xmpPayload));
  parts.push(u8.slice(2));
  return concatParts(parts);
}

/* ---------- WebP: EXIF + XMP chunks, set VP8X flags ---------- */
function addMetadataWebp(buf, f){
  const u8 = u8of(buf);
  const chunks = parseWebpChunks(u8);
  chunks.push({fourcc: 'EXIF', data: buildTiff(f)});
  chunks.push({fourcc: 'XMP ', data: buildXmp(f)});
  const vx = chunks.find(c => c.fourcc === 'VP8X');
  if (vx && vx.data.length >= 1){ vx.data = vx.data.slice(); vx.data[0] |= 0x0C; }
  return buildWebp(chunks);
}

function addMetadata(buf, mime, fields){
  if (mime === 'image/png') return addMetadataPng(buf, fields);
  if (mime === 'image/jpeg') return addMetadataJpeg(buf, fields);
  if (mime === 'image/webp') return addMetadataWebp(buf, fields);
  throw new Error('unsupported');
}

function cleanImage(buf, mime){
  if (mime === 'image/png') return stripPng(buf);
  if (mime === 'image/jpeg') return stripJpeg(buf);
  if (mime === 'image/webp') return stripWebp(buf);
  throw new Error('unsupported');
}

export { cleanImage, addMetadata };

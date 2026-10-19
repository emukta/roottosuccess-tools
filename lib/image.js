// Browser-side image helpers: decode (incl. HEIC), draw, encode (incl. BMP/TIFF), download, zip.

export const OUTPUT_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/bmp": "bmp",
  "image/tiff": "tif",
};

export const IMAGE_EXT_RE = /\.(jpe?g|jfif|png|webp|gif|bmp|avif|svg|heic|heif)$/i;

export function isImageFile(f) {
  return (f.type && f.type.startsWith("image/")) || IMAGE_EXT_RE.test(f.name);
}

export function isHeif(f) {
  return /\.(heic|heif)$/i.test(f.name) || /hei[cf]/i.test(f.type || "");
}

export function loadImage(blob) {
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("এই ব্রাউজার ছবিটি পড়তে পারছে না। অন্য ফরম্যাট চেষ্টা করুন।"));
    };
    img.src = url;
  });
}

export async function decodeImage(file) {
  if (isHeif(file)) {
    const { default: heic2any } = await import("heic2any");
    const out = await heic2any({ blob: file, toType: "image/png", quality: 1 });
    return loadImage(Array.isArray(out) ? out[0] : out);
  }
  return loadImage(file);
}

export function drawToCanvas(img, { width, height, solidBg = false, bg = "#ffffff" } = {}) {
  const w = width || img.naturalWidth || img.width;
  const h = height || img.naturalHeight || img.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: !solidBg });
  if (solidBg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

export function canvasToBlob(canvas, mime, quality = 0.92) {
  if (mime === "image/bmp") return Promise.resolve(encodeBMP(canvas));
  if (mime === "image/tiff") return Promise.resolve(encodeTIFF(canvas));
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, quality));
}

// Some browsers silently return PNG when they cannot encode the requested type.
export async function encodeWithFallback(canvas, mime, quality) {
  let blob = await canvasToBlob(canvas, mime, quality);
  let finalMime = mime;
  if (!blob || (blob.type && blob.type !== mime && mime !== "image/bmp" && mime !== "image/tiff")) {
    blob = await canvasToBlob(canvas, "image/png", 1);
    finalMime = "image/png";
  }
  if (!blob) throw new Error("এই ব্রাউজার নির্বাচিত ফরম্যাটে সেভ করতে পারছে না।");
  return { blob, mime: finalMime };
}

function encodeBMP(canvas) {
  const w = canvas.width, h = canvas.height;
  const data = canvas.getContext("2d").getImageData(0, 0, w, h).data;
  const rowSize = Math.floor((24 * w + 31) / 32) * 4;
  const pixelSize = rowSize * h;
  const buf = new ArrayBuffer(54 + pixelSize);
  const dv = new DataView(buf);
  dv.setUint8(0, 66); dv.setUint8(1, 77);
  dv.setUint32(2, 54 + pixelSize, true);
  dv.setUint32(10, 54, true);
  dv.setUint32(14, 40, true);
  dv.setInt32(18, w, true);
  dv.setInt32(22, h, true);
  dv.setUint16(26, 1, true);
  dv.setUint16(28, 24, true);
  dv.setUint32(34, pixelSize, true);
  dv.setInt32(38, 2835, true);
  dv.setInt32(42, 2835, true);
  let offset = 54;
  for (let y = h - 1; y >= 0; y--) {
    let p = offset;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      dv.setUint8(p++, data[i + 2]);
      dv.setUint8(p++, data[i + 1]);
      dv.setUint8(p++, data[i]);
    }
    offset += rowSize;
  }
  return new Blob([buf], { type: "image/bmp" });
}

function encodeTIFF(canvas) {
  const w = canvas.width, h = canvas.height;
  const image = canvas.getContext("2d").getImageData(0, 0, w, h).data;
  const rgbSize = w * h * 3;
  const ifdOffset = 8;
  const entries = [
    [256, 4, 1, w], [257, 4, 1, h], [258, 3, 3, 0], [259, 3, 1, 1], [262, 3, 1, 2],
    [273, 4, 1, 0], [277, 3, 1, 3], [278, 4, 1, h], [279, 4, 1, rgbSize],
    [282, 5, 1, 0], [283, 5, 1, 0], [296, 3, 1, 2],
  ];
  const ifdSize = 2 + entries.length * 12 + 4;
  const bitsOffset = ifdOffset + ifdSize;
  const xres = bitsOffset + 6;
  const yres = xres + 8;
  const pixelOffset = yres + 8;
  const buf = new ArrayBuffer(pixelOffset + rgbSize);
  const dv = new DataView(buf);
  dv.setUint8(0, 73); dv.setUint8(1, 73);
  dv.setUint16(2, 42, true);
  dv.setUint32(4, ifdOffset, true);
  dv.setUint16(ifdOffset, entries.length, true);
  let p = ifdOffset + 2;
  for (const [tag, type, count, v] of entries) {
    let value = v;
    if (tag === 258) value = bitsOffset;
    if (tag === 273) value = pixelOffset;
    if (tag === 282) value = xres;
    if (tag === 283) value = yres;
    dv.setUint16(p, tag, true);
    dv.setUint16(p + 2, type, true);
    dv.setUint32(p + 4, count, true);
    if (type === 3 && count === 1) dv.setUint16(p + 8, value, true);
    else dv.setUint32(p + 8, value, true);
    p += 12;
  }
  dv.setUint32(p, 0, true);
  dv.setUint16(bitsOffset, 8, true);
  dv.setUint16(bitsOffset + 2, 8, true);
  dv.setUint16(bitsOffset + 4, 8, true);
  dv.setUint32(xres, 72, true); dv.setUint32(xres + 4, 1, true);
  dv.setUint32(yres, 72, true); dv.setUint32(yres + 4, 1, true);
  const out = new Uint8Array(buf, pixelOffset);
  for (let i = 0, j = 0; i < image.length; i += 4) {
    out[j++] = image[i];
    out[j++] = image[i + 1];
    out[j++] = image[i + 2];
  }
  return new Blob([buf], { type: "image/tiff" });
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function downloadZip(files, zipName) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const used = new Set();
  for (const { name, blob } of files) {
    let n = name;
    let k = 1;
    while (used.has(n)) n = name.replace(/(\.[^.]+)?$/, `-${k++}$1`);
    used.add(n);
    zip.file(n, blob);
  }
  const out = await zip.generateAsync({ type: "blob" });
  downloadBlob(out, zipName);
}

export function nextFrame() {
  return new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
}

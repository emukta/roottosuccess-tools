"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Trash2, Archive, X, ShieldCheck, Undo2, PenLine, ChevronDown, ScanSearch, Palette } from "lucide-react";
import Dropzone from "../Dropzone";
import { Button, Card, Pill } from "../ui";
import { useToast } from "../Providers";
import { cleanImage, addMetadata } from "@/lib/metadata";
import { downloadBlob, downloadZip } from "@/lib/image";
import { baseName, fmtBytes, toBn, uid } from "@/lib/format";

const MIME_BY_EXT = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", jfif: "image/jpeg", webp: "image/webp" };
const STORE_KEY = "rts-meta-defaults";

function mimeOf(file) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  return MIME_BY_EXT[ext] || (["image/png", "image/jpeg", "image/webp"].includes(file.type) ? file.type : "");
}

export default function MetadataCleaner() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [showMeta, setShowMeta] = useState(false);
  const [meta, setMeta] = useState({ title: "", description: "", keywords: "", author: "", copyright: "", software: "" });
  const [applied, setApplied] = useState(false);
  const urls = useRef(new Set());

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      setMeta((m) => ({ ...m, author: s.author || "", copyright: s.copyright || "", software: s.software || "" }));
    } catch {}
    const set = urls.current;
    return () => set.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const mkUrl = (bytes, mime) => {
    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    urls.current.add(url);
    return { blob, url };
  };

  async function addFiles(files) {
    const ok = files.filter((f) => mimeOf(f));
    if (!ok.length) return toast("শুধু JPG, PNG বা WebP ছবি দিন", "error");
    const next = [];
    for (const file of ok) {
      const mime = mimeOf(file);
      try {
        const res = cleanImage(await file.arrayBuffer(), mime);
        const { blob, url } = mkUrl(res.bytes, mime);
        next.push({ id: uid(), file, mime, clean: res.bytes, blob, url, removed: res.removed, iccKept: !!res.iccKept, meta: false });
      } catch {
        next.push({ id: uid(), file, mime, error: true });
      }
    }
    setItems((p) => [...next, ...p]);
    setApplied(false);
    const removed = next.reduce((s, i) => s + (i.removed?.length || 0), 0);
    toast(`${toBn(next.length)}টি ছবি ক্লিন হয়েছে · ${toBn(removed)}টি মেটাডাটা সরানো হয়েছে`);
  }

  const kw = meta.keywords.split(",").map((s) => s.trim()).filter(Boolean);
  const hasMeta = meta.title || meta.description || kw.length || meta.author || meta.copyright || meta.software;

  function outName(it, idx) {
    const ext = it.mime === "image/jpeg" ? "jpg" : it.mime.split("/")[1];
    if (meta.title.trim()) {
      const b = baseName(meta.title.toLowerCase());
      return `${b}${items.length > 1 ? `-${idx + 1}` : ""}.${ext}`;
    }
    return `clean-${baseName(it.file.name)}.${ext}`;
  }

  function applyMeta() {
    if (!hasMeta) return toast("অন্তত একটি ঘর পূরণ করুন", "error");
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ author: meta.author, copyright: meta.copyright, software: meta.software }));
    } catch {}
    const fields = { ...meta, keywords: kw };
    setItems((prev) =>
      prev.map((it) => {
        if (it.error) return it;
        try {
          const bytes = addMetadata(it.clean, it.mime, fields);
          URL.revokeObjectURL(it.url);
          const { blob, url } = mkUrl(bytes, it.mime);
          return { ...it, blob, url, meta: true };
        } catch {
          return it;
        }
      })
    );
    setApplied(true);
    toast("সব ছবিতে নতুন মেটাডাটা যোগ হয়েছে");
  }

  function revertMeta() {
    setItems((prev) =>
      prev.map((it) => {
        if (!it.meta) return it;
        URL.revokeObjectURL(it.url);
        const { blob, url } = mkUrl(it.clean, it.mime);
        return { ...it, blob, url, meta: false };
      })
    );
    setApplied(false);
    toast("মেটাডাটা বাদ দেওয়া হয়েছে", "info");
  }

  function remove(id) {
    setItems((p) => p.filter((i) => i.id !== id));
  }

  const ready = items.filter((i) => !i.error);
  const totalRemoved = ready.reduce((s, i) => s + i.removed.length, 0);

  async function zipAll() {
    if (ready.length === 1) return downloadBlob(ready[0].blob, outName(ready[0], 0));
    await downloadZip(ready.map((it, i) => ({ name: outName(it, items.indexOf(it)), blob: it.blob })), "cleaned-images.zip");
    toast("ZIP ডাউনলোড শুরু হয়েছে");
  }

  const F = ({ k, label, ph, area }) => (
    <div className={area ? "sm:col-span-2" : ""}>
      <label htmlFor={`m-${k}`} className="label">
        {label}
      </label>
      {area ? (
        <textarea id={`m-${k}`} rows={2} className="field resize-y" placeholder={ph} value={meta[k]} onChange={(e) => setMeta({ ...meta, [k]: e.target.value })} />
      ) : (
        <input id={`m-${k}`} className="field" placeholder={ph} value={meta[k]} onChange={(e) => setMeta({ ...meta, [k]: e.target.value })} />
      )}
    </div>
  );

  return (
    <div className="grid gap-5">
      <Dropzone
        onFiles={addFiles}
        accept="image/png,image/jpeg,image/webp,.jpg,.jpeg,.png,.webp,.jfif"
        title="ছবি এখানে ড্র্যাগ করুন"
        hint="ড্রপ করার সাথে সাথেই মেটাডাটা ক্লিন হয়ে যাবে"
        formats={["JPG", "PNG", "WEBP"]}
      />

      {items.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              [toBn(ready.length), "মোট ছবি"],
              [toBn(totalRemoved), "মেটাডাটা সরানো"],
              [toBn(ready.filter((i) => i.meta).length), "নতুন মেটাডাটা"],
            ].map(([n, l]) => (
              <Card key={l} className="p-4 text-center">
                <motion.p key={n} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-3xl font-bold text-forest-700">
                  {n}
                </motion.p>
                <p className="mt-1 text-[13px] font-semibold text-muted">{l}</p>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMeta((s) => !s)}
              aria-expanded={showMeta}
              className="flex w-full items-center justify-between gap-3 p-5 text-left"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-sun-soft text-soil">
                  <PenLine className="size-5" />
                </span>
                <span>
                  <span className="block font-bold text-forest-900">নিজের মেটাডাটা যোগ করুন</span>
                  <span className="block text-[13px] text-muted">টাইটেল, কিওয়ার্ড, কপিরাইট — Adobe Stock সাবমিটের জন্য কাজে লাগে (ঐচ্ছিক)</span>
                </span>
              </span>
              <motion.span animate={{ rotate: showMeta ? 180 : 0 }}>
                <ChevronDown className="size-5 text-forest-700" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {showMeta && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-2">
                    {F({ k: "title", label: "টাইটেল", ph: "যেমন: Fresh green tea garden in Sylhet", area: true })}
                    {F({ k: "description", label: "বিবরণ", ph: "ছবির বর্ণনা…", area: true })}
                    {F({ k: "keywords", label: "কিওয়ার্ড (কমা দিয়ে আলাদা করুন)", ph: "tea, garden, green, nature", area: true })}
                    {F({ k: "author", label: "লেখক / ক্রিয়েটর", ph: "আপনার নাম" })}
                    {F({ k: "copyright", label: "কপিরাইট", ph: "© 2026 আপনার নাম" })}
                    {F({ k: "software", label: "সফটওয়্যার (ঐচ্ছিক)", ph: "যেমন: Photoshop" })}
                    <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
                      <Button onClick={applyMeta}>
                        <ShieldCheck className="size-4" /> সব ছবিতে প্রয়োগ করুন
                      </Button>
                      {applied && (
                        <Button variant="outline" onClick={revertMeta}>
                          <Undo2 className="size-4" /> মেটাডাটা বাদ দিন
                        </Button>
                      )}
                    </div>
                    {kw.length > 0 && <p className="text-[13px] text-muted sm:col-span-2">{toBn(kw.length)}টি কিওয়ার্ড</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="sun" onClick={zipAll} disabled={!ready.length}>
              <Archive className="size-4" /> সব একসাথে ডাউনলোড {ready.length > 1 ? "(ZIP)" : ""}
            </Button>
            <Button variant="danger" onClick={() => (setItems([]), setApplied(false))}>
              <Trash2 className="size-4" /> সব মুছুন
            </Button>
          </div>
        </>
      )}

      <motion.ul layout className="grid gap-3">
        <AnimatePresence initial={false}>
          {items.map((it, idx) => (
            <motion.li
              key={it.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
              className="flex flex-col gap-3 rounded-2xl bg-paper p-3 ring-1 ring-line sm:flex-row sm:gap-4 sm:p-4"
            >
              {it.url ? (
                <img src={it.url} alt="" className="checker h-44 w-full rounded-xl object-cover ring-1 ring-line sm:size-24 sm:shrink-0" />
              ) : (
                <div className="grid h-24 place-items-center rounded-xl bg-danger/5 text-sm text-danger sm:size-24">ত্রুটি</div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-forest-900">{it.error ? it.file.name : outName(it, idx)}</p>
                    <p className="text-[13px] text-muted">
                      {fmtBytes(it.file.size)}
                      {!it.error && (
                        <>
                          {" → "}
                          <b className="text-forest-700">{fmtBytes(it.blob.size)}</b>
                        </>
                      )}
                    </p>
                  </div>
                  <button type="button" onClick={() => remove(it.id)} className="grid size-9 shrink-0 place-items-center rounded-xl text-muted hover:bg-danger/5 hover:text-danger" aria-label="সরান">
                    <X className="size-4" />
                  </button>
                </div>
                {it.error ? (
                  <p className="mt-2 text-[13px] text-danger">ফাইলটি পড়া যায়নি — ফাইলটি নষ্ট হতে পারে।</p>
                ) : (
                  <>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {it.removed.length === 0 && (
                        <Pill>
                          <ScanSearch className="size-3.5" /> আগে থেকেই পরিষ্কার ছিল
                        </Pill>
                      )}
                      {it.removed.slice(0, 6).map((r, i) => (
                        <Pill key={i} tone="danger">
                          ✂ {r.label}
                        </Pill>
                      ))}
                      {it.removed.length > 6 && <Pill tone="danger">+{toBn(it.removed.length - 6)}</Pill>}
                      {it.iccKept && (
                        <Pill>
                          <Palette className="size-3.5" /> কালার প্রোফাইল রাখা হয়েছে
                        </Pill>
                      )}
                      {it.meta && <Pill tone="sun">＋ নতুন মেটাডাটা</Pill>}
                    </div>
                    <Button size="sm" className="mt-3" onClick={() => downloadBlob(it.blob, outName(it, idx))}>
                      <Download className="size-4" /> ডাউনলোড
                    </Button>
                  </>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Card className="p-5 sm:p-6">
        <h2 className="font-bold text-forest-900">এটা কীভাবে কাজ করে?</h2>
        <ul className="mt-3 grid gap-2 text-[15px] text-muted">
          <li>• ছবির EXIF (ক্যামেরা, তারিখ, GPS লোকেশন), XMP, IPTC, C2PA/JUMBF ও কমেন্ট মেটাডাটা সরিয়ে দেয়।</li>
          <li>• ছবি আবার এনকোড করা হয় না — তাই কোয়ালিটি একদম আগের মতোই থাকে।</li>
          <li>• সব কাজ আপনার ব্রাউজারেই হয়, ছবি কোনো সার্ভারে যায় না।</li>
          <li className="text-soil">• সতর্কতা: ছবির পিক্সেলে লুকানো ওয়াটারমার্ক বা প্ল্যাটফর্মের নিজস্ব ডিটেকশন এই টুল নিয়ন্ত্রণ করে না।</li>
        </ul>
      </Card>
    </div>
  );
}

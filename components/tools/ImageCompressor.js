"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Trash2, Archive, X, Gauge, TrendingDown } from "lucide-react";
import Dropzone from "../Dropzone";
import { Button, Card, RangeField, Segmented, Pill } from "../ui";
import { useToast } from "../Providers";
import { OUTPUT_EXT, isImageFile, decodeImage, drawToCanvas, encodeWithFallback, downloadBlob, downloadZip, nextFrame } from "@/lib/image";
import { baseName, fmtBytes, toBn, uid } from "@/lib/format";

const PRESETS = [
  { value: "0", label: "আসল মাপ" },
  { value: "2560", label: "২৫৬০px" },
  { value: "1920", label: "১৯২০px (ফেসবুক)" },
  { value: "1280", label: "১২৮০px" },
  { value: "800", label: "৮০০px" },
];

export default function ImageCompressor() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [quality, setQuality] = useState(75);
  const [maxSide, setMaxSide] = useState("1920");
  const [format, setFormat] = useState("image/jpeg");
  const [busy, setBusy] = useState(false);
  const urls = useRef(new Set());

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  async function process(list) {
    setBusy(true);
    for (const it of list) {
      setItems((p) => p.map((x) => (x.id === it.id ? { ...x, status: "working" } : x)));
      await nextFrame();
      try {
        const { img, url } = await decodeImage(it.file);
        let w = img.naturalWidth, h = img.naturalHeight;
        const m = Number(maxSide);
        if (m && Math.max(w, h) > m) {
          const r = m / Math.max(w, h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        const canvas = drawToCanvas(img, { width: w, height: h, solidBg: format === "image/jpeg" });
        URL.revokeObjectURL(url);
        const { blob, mime } = await encodeWithFallback(canvas, format, quality / 100);
        const outUrl = URL.createObjectURL(blob);
        urls.current.add(outUrl);
        setItems((p) =>
          p.map((x) =>
            x.id === it.id
              ? { ...x, status: "done", out: { blob, url: outUrl, w, h, name: `${baseName(it.file.name)}-compressed.${OUTPUT_EXT[mime]}` } }
              : x
          )
        );
      } catch (e) {
        setItems((p) => p.map((x) => (x.id === it.id ? { ...x, status: "error" } : x)));
      }
    }
    setBusy(false);
  }

  function addFiles(files) {
    const imgs = files.filter(isImageFile);
    if (!imgs.length) return toast("কোনো ছবি পাওয়া যায়নি", "error");
    const add = imgs.map((file) => ({ id: uid(), file, status: "waiting" }));
    setItems((p) => [...add, ...p]);
    process(add);
  }

  // Re-run when settings change (debounced)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) return void (first.current = false);
    const t = setTimeout(() => {
      if (items.length && !busy) process(items);
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, maxSide, format]);

  const done = items.filter((i) => i.status === "done");
  const before = done.reduce((s, i) => s + i.file.size, 0);
  const after = done.reduce((s, i) => s + i.out.blob.size, 0);
  const saved = before ? Math.max(0, Math.round((1 - after / before) * 100)) : 0;

  async function downloadAll() {
    if (done.length === 1) return downloadBlob(done[0].out.blob, done[0].out.name);
    await downloadZip(done.map((d) => ({ name: d.out.name, blob: d.out.blob })), "compressed-images.zip");
    toast("ZIP ডাউনলোড শুরু হয়েছে");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
      <Card className="order-2 p-5 sm:p-6 lg:sticky lg:top-24 lg:order-1">
        <h2 className="text-lg font-bold text-forest-900">সেটিংস</h2>
        <div className="mt-4 grid gap-5">
          <div>
            <p className="label">ফরম্যাট</p>
            <Segmented
              label="ফরম্যাট"
              value={format}
              onChange={setFormat}
              options={[
                { value: "image/jpeg", label: "JPG" },
                { value: "image/webp", label: "WEBP" },
              ]}
            />
          </div>
          <RangeField label="কোয়ালিটি" min={20} max={95} value={quality} onChange={setQuality} display={`${toBn(quality)}%`} />
          <div>
            <p className="label">সর্বোচ্চ মাপ (লম্বা দিক)</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setMaxSide(p.value)}
                  aria-pressed={maxSide === p.value}
                  className={`min-h-10 rounded-xl px-3 text-sm font-semibold ring-1 ring-inset transition ${
                    maxSide === p.value ? "bg-forest-700 text-white ring-forest-700" : "bg-paper text-forest-800 ring-line-strong hover:ring-forest-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[13px] text-muted">সেটিংস বদলালে সব ছবি স্বয়ংক্রিয়ভাবে আবার কমপ্রেস হবে।</p>
        </div>
      </Card>

      <div className="order-1 grid gap-5 lg:order-2">
        <Dropzone onFiles={addFiles} accept="image/*,.heic,.heif" title="ছবি এখানে ড্র্যাগ করুন" hint="ড্রপ করলেই কমপ্রেস শুরু হবে" formats={["JPG", "PNG", "WEBP", "HEIC"]} />

        {done.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-leaf-soft text-forest-700">
                  <TrendingDown className="size-7" />
                </span>
                <div>
                  <p className="font-display text-3xl font-bold text-forest-700">{toBn(saved)}% ছোট</p>
                  <p className="text-[14px] text-muted">
                    {fmtBytes(before)} → {fmtBytes(after)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Button variant="sun" onClick={downloadAll} disabled={busy}>
                  <Archive className="size-4" /> সব ডাউনলোড
                </Button>
                <Button variant="danger" onClick={() => setItems([])} disabled={busy}>
                  <Trash2 className="size-4" /> মুছুন
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.ul layout className="grid gap-3">
          <AnimatePresence initial={false}>
            {items.map((it) => {
              const pct = it.out ? Math.round((1 - it.out.blob.size / it.file.size) * 100) : 0;
              return (
                <motion.li
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
                  className="flex items-center gap-3 rounded-2xl bg-paper p-3 ring-1 ring-line sm:gap-4"
                >
                  <div className="checker grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl ring-1 ring-line">
                    {it.out ? <img src={it.out.url} alt="" className="size-full object-cover" /> : <Gauge className="size-5 animate-pulse text-muted" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-forest-900">{it.file.name}</p>
                    <p className="text-[13px] text-muted">
                      {fmtBytes(it.file.size)}
                      {it.out && (
                        <>
                          {" → "}
                          <b className="text-forest-700">{fmtBytes(it.out.blob.size)}</b> · {toBn(it.out.w)}×{toBn(it.out.h)}
                        </>
                      )}
                      {it.status === "working" && " · কমপ্রেস হচ্ছে…"}
                      {it.status === "error" && <span className="text-danger"> · ব্যর্থ</span>}
                    </p>
                    {it.out && (
                      <Pill tone={pct > 0 ? "leaf" : "sun"} className="mt-1.5">
                        {pct > 0 ? `${toBn(pct)}% কমেছে` : "আর কমানো যায়নি — কোয়ালিটি কমান"}
                      </Pill>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {it.out && (
                      <button type="button" onClick={() => downloadBlob(it.out.blob, it.out.name)} className="grid size-10 place-items-center rounded-xl bg-forest-700 text-white hover:bg-forest-800" aria-label="ডাউনলোড">
                        <Download className="size-4" />
                      </button>
                    )}
                    <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="grid size-10 place-items-center rounded-xl text-muted hover:bg-danger/5 hover:text-danger" aria-label="সরান">
                      <X className="size-4" />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  );
}

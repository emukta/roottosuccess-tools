"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Trash2, RefreshCw, Archive, X, CheckCircle2, AlertTriangle, Loader2, Wand2 } from "lucide-react";
import Dropzone from "../Dropzone";
import { Button, Card, RangeField, SelectField, Toggle, Pill } from "../ui";
import { useToast } from "../Providers";
import {
  OUTPUT_EXT,
  isImageFile,
  decodeImage,
  drawToCanvas,
  encodeWithFallback,
  downloadBlob,
  downloadZip,
  nextFrame,
} from "@/lib/image";
import { baseName, fmtBytes, toBn, uid } from "@/lib/format";

const FORMATS = [
  { value: "image/png", label: "PNG — লসলেস, ট্রান্সপারেন্ট" },
  { value: "image/jpeg", label: "JPG — ছোট সাইজ, ফটো" },
  { value: "image/webp", label: "WEBP — ওয়েবের জন্য সেরা" },
  { value: "image/avif", label: "AVIF — আধুনিক, সবচেয়ে ছোট" },
  { value: "image/bmp", label: "BMP — লসলেস" },
  { value: "image/tiff", label: "TIFF — প্রিন্টের জন্য" },
];
const LOSSY = ["image/jpeg", "image/webp", "image/avif"];
const SOLID = ["image/jpeg", "image/bmp", "image/tiff"];

export default function ImageConverter() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState(90);
  const [whiteBg, setWhiteBg] = useState(true);
  const [running, setRunning] = useState(false);
  const urls = useRef(new Set());

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const track = (u) => (urls.current.add(u), u);
  const revoke = (u) => u && (URL.revokeObjectURL(u), urls.current.delete(u));

  function addFiles(files) {
    const imgs = files.filter(isImageFile);
    const skipped = files.length - imgs.length;
    if (!imgs.length) return toast("কোনো ছবি পাওয়া যায়নি", "error");
    setItems((prev) => {
      const seen = new Set(prev.map((p) => p.key));
      const add = imgs
        .map((file) => ({
          id: uid(),
          key: `${file.webkitRelativePath || file.name}-${file.size}-${file.lastModified}`,
          file,
          thumb: /hei[cf]/i.test(file.name) ? null : track(URL.createObjectURL(file)),
          status: "waiting",
        }))
        .filter((i) => !seen.has(i.key));
      return [...prev, ...add];
    });
    toast(`${toBn(imgs.length)}টি ছবি যোগ হয়েছে${skipped ? ` (${toBn(skipped)}টি অন্য ফাইল বাদ)` : ""}`);
  }

  const patch = (id, data) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));

  async function convertAll(onlyId) {
    const targets = items.filter((i) => (onlyId ? i.id === onlyId : true));
    if (!targets.length) return toast("আগে ছবি যোগ করুন", "error");
    setRunning(true);
    for (const item of targets) {
      patch(item.id, { status: "working", error: null });
      await nextFrame();
      try {
        const { img, url } = await decodeImage(item.file);
        const solid = SOLID.includes(format);
        const canvas = drawToCanvas(img, { solidBg: solid && whiteBg });
        URL.revokeObjectURL(url);
        const { blob, mime } = await encodeWithFallback(canvas, format, quality / 100);
        revoke(item.result?.url);
        const outUrl = track(URL.createObjectURL(blob));
        patch(item.id, {
          status: "done",
          result: {
            blob,
            url: outUrl,
            mime,
            name: `${baseName(item.file.name)}.${OUTPUT_EXT[mime]}`,
            w: canvas.width,
            h: canvas.height,
          },
          thumb: item.thumb || outUrl,
        });
        if (mime !== format) toast("আপনার ব্রাউজার এই ফরম্যাট সাপোর্ট করে না, PNG দেওয়া হয়েছে", "info");
      } catch (e) {
        patch(item.id, { status: "error", error: e.message || "কনভার্ট করা যায়নি" });
      }
    }
    setRunning(false);
    toast("কনভার্ট সম্পন্ন হয়েছে");
  }

  function remove(id) {
    setItems((prev) => {
      const it = prev.find((i) => i.id === id);
      if (it) {
        revoke(it.result?.url);
        if (it.thumb !== it.result?.url) revoke(it.thumb);
      }
      return prev.filter((i) => i.id !== id);
    });
  }

  function clearAll() {
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current.clear();
    setItems([]);
  }

  const done = useMemo(() => items.filter((i) => i.status === "done"), [items]);
  const progress = items.length ? Math.round((items.filter((i) => i.status === "done" || i.status === "error").length / items.length) * 100) : 0;

  async function downloadAll() {
    if (done.length === 1) return downloadBlob(done[0].result.blob, done[0].result.name);
    await downloadZip(done.map((d) => ({ name: d.result.name, blob: d.result.blob })), `converted-images-${Date.now()}.zip`);
    toast("ZIP ডাউনলোড শুরু হয়েছে");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
      <Card className="order-2 p-5 sm:p-6 lg:sticky lg:top-24 lg:order-1">
        <h2 className="text-lg font-bold text-forest-900">সেটিংস</h2>
        <div className="mt-4 grid gap-5">
          <SelectField label="কোন ফরম্যাটে চান?" value={format} onChange={setFormat} options={FORMATS} />
          <AnimatePresence initial={false}>
            {LOSSY.includes(format) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <RangeField label="কোয়ালিটি" min={30} max={100} value={quality} onChange={setQuality} display={`${toBn(quality)}%`} />
                <p className="mt-1 text-[13px] text-muted">কম কোয়ালিটি = ছোট ফাইল সাইজ। ৮০–৯০% সাধারণত সেরা।</p>
              </motion.div>
            )}
          </AnimatePresence>
          {SOLID.includes(format) && (
            <Toggle checked={whiteBg} onChange={setWhiteBg} label="ট্রান্সপারেন্ট অংশ সাদা করুন" hint="JPG/BMP/TIFF এ ট্রান্সপারেন্সি থাকে না" />
          )}
          <div className="rounded-2xl bg-sun-soft p-3.5 text-[13px] leading-relaxed text-soil">
            <b>ইনপুট:</b> JPG, PNG, WEBP, GIF, BMP, AVIF, SVG, HEIC (iPhone)। GIF এর শুধু প্রথম ফ্রেম কনভার্ট হবে।
          </div>
        </div>
      </Card>

      <div className="order-1 grid gap-5 lg:order-2">
        <Dropzone
          onFiles={addFiles}
          accept="image/*,.heic,.heif,.jfif,.avif,.svg"
          allowFolder
          title="ছবি এখানে ড্র্যাগ করুন"
          hint="অথবা ক্লিক করে এক বা একাধিক ছবি বাছাই করুন"
          formats={["JPG", "PNG", "WEBP", "HEIC", "AVIF", "GIF", "SVG", "BMP"]}
        />

        {items.length > 0 && (
          <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Pill>{toBn(items.length)}টি ফাইল</Pill>
                <Pill tone="sun">{toBn(done.length)}টি সম্পন্ন</Pill>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Button onClick={() => convertAll()} loading={running} className="col-span-2 sm:col-span-1">
                  {!running && <Wand2 className="size-4" />} কনভার্ট করুন
                </Button>
                <Button variant="sun" onClick={downloadAll} disabled={!done.length || running}>
                  <Archive className="size-4" /> সব ডাউনলোড
                </Button>
                <Button variant="danger" onClick={clearAll} disabled={running}>
                  <Trash2 className="size-4" /> মুছুন
                </Button>
              </div>
            </div>
            {(running || progress > 0) && (
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-forest-600 via-leaf to-sun"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            )}
          </Card>
        )}

        <motion.ul layout className="grid gap-3">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.li
                key={it.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
                className="flex gap-3 rounded-2xl bg-paper p-3 ring-1 ring-line sm:gap-4 sm:p-4"
              >
                <div className="checker grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl ring-1 ring-line sm:size-24">
                  {it.thumb ? (
                    <img src={it.thumb} alt="" className="size-full object-contain" />
                  ) : (
                    <span className="text-xs font-bold text-muted">HEIC</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold text-forest-900" title={it.file.name}>
                      {it.file.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      className="-mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-xl text-muted hover:bg-danger/5 hover:text-danger"
                      aria-label="সরান"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="text-[13px] text-muted">
                    {fmtBytes(it.file.size)}
                    {it.result && (
                      <>
                        {" → "}
                        <b className="text-forest-700">{fmtBytes(it.result.blob.size)}</b>
                        {" · "}
                        {toBn(it.result.w)}×{toBn(it.result.h)} · {OUTPUT_EXT[it.result.mime].toUpperCase()}
                      </>
                    )}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <Status s={it.status} />
                    {it.status === "done" && (
                      <Button size="sm" variant="primary" onClick={() => downloadBlob(it.result.blob, it.result.name)}>
                        <Download className="size-4" /> ডাউনলোড
                      </Button>
                    )}
                    {it.status === "error" && (
                      <Button size="sm" variant="outline" onClick={() => convertAll(it.id)} disabled={running}>
                        <RefreshCw className="size-4" /> আবার চেষ্টা
                      </Button>
                    )}
                  </div>
                  {it.error && <p className="mt-2 text-[13px] text-danger">{it.error}</p>}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  );
}

function Status({ s }) {
  if (s === "done")
    return (
      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-forest-600">
        <CheckCircle2 className="size-4" /> সম্পন্ন
      </span>
    );
  if (s === "working")
    return (
      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-sun-deep">
        <Loader2 className="size-4 animate-spin" /> কনভার্ট হচ্ছে…
      </span>
    );
  if (s === "error")
    return (
      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-danger">
        <AlertTriangle className="size-4" /> ব্যর্থ
      </span>
    );
  return <span className="text-[13px] font-semibold text-muted">অপেক্ষমাণ</span>;
}

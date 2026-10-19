"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, RefreshCw, Sparkles, ImageOff } from "lucide-react";
import Dropzone from "../Dropzone";
import BeforeAfter from "../BeforeAfter";
import { Button, Card, RangeField, Segmented, Toggle } from "../ui";
import { useToast } from "../Providers";
import { decodeImage, downloadBlob, encodeWithFallback, nextFrame, isImageFile } from "@/lib/image";
import { baseName, fmtBytes, toBn } from "@/lib/format";

const MAX_SIDE = 8192;
const MAX_PIXELS = 36_000_000;

// Progressive upscaling (≤2x per step) keeps edges smoother than one big jump
function upscale(img, scale) {
  const sw = img.naturalWidth, sh = img.naturalHeight;
  const tw = Math.round(sw * scale), th = Math.round(sh * scale);
  let src = img, cw = sw, ch = sh;
  let canvas = null;
  while (cw < tw || ch < th) {
    const nw = Math.min(tw, cw * 2), nh = Math.min(th, ch * 2);
    const c = document.createElement("canvas");
    c.width = nw;
    c.height = nh;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, 0, 0, nw, nh);
    src = canvas = c;
    cw = nw;
    ch = nh;
  }
  return canvas;
}

// Unsharp mask: out = orig + amount * (orig - blur3x3)
function sharpen(canvas, amount) {
  if (amount <= 0) return;
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const id = ctx.getImageData(0, 0, w, h);
  const d = id.data;
  const src = new Uint8ClampedArray(d);
  const row = w * 4;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * row + x * 4;
      for (let c = 0; c < 3; c++) {
        const k = i + c;
        const blur =
          (src[k - row - 4] + src[k - row] * 2 + src[k - row + 4] +
            src[k - 4] * 2 + src[k] * 4 + src[k + 4] * 2 +
            src[k + row - 4] + src[k + row] * 2 + src[k + row + 4]) / 16;
        d[k] = src[k] + amount * (src[k] - blur);
      }
    }
  }
  ctx.putImageData(id, 0, 0);
}

export default function ImageUpscaler() {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [orig, setOrig] = useState(null); // {url, w, h}
  const [scale, setScale] = useState(2);
  const [sharp, setSharp] = useState(60);
  const [asJpg, setAsJpg] = useState(false);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState(null); // {url, blob, w, h}
  const imgRef = useRef(null);

  useEffect(() => () => {
    orig && URL.revokeObjectURL(orig.url);
  }, [orig]);
  useEffect(() => () => {
    out && URL.revokeObjectURL(out.url);
  }, [out]);

  async function pick(files) {
    const f = files.find(isImageFile);
    if (!f) return toast("একটি ছবি দিন", "error");
    try {
      const { img, url } = await decodeImage(f);
      imgRef.current = img;
      setFile(f);
      setOut(null);
      setOrig({ url, w: img.naturalWidth, h: img.naturalHeight });
    } catch (e) {
      toast(e.message, "error");
    }
  }

  const tw = orig ? Math.round(orig.w * scale) : 0;
  const th = orig ? Math.round(orig.h * scale) : 0;
  const tooBig = orig && (tw > MAX_SIDE || th > MAX_SIDE || tw * th > MAX_PIXELS);

  async function run() {
    if (!imgRef.current || tooBig) return;
    setBusy(true);
    await nextFrame();
    try {
      const canvas = upscale(imgRef.current, scale);
      await nextFrame();
      sharpen(canvas, (sharp / 100) * 1.2);
      const { blob } = await encodeWithFallback(canvas, asJpg ? "image/jpeg" : "image/png", 0.95);
      setOut({ url: URL.createObjectURL(blob), blob, w: canvas.width, h: canvas.height });
      toast(`${toBn(scale)}x আপস্কেল সম্পন্ন`);
    } catch (e) {
      toast("প্রসেস করা যায়নি — ছবিটি অনেক বড় হতে পারে", "error");
    }
    setBusy(false);
  }

  function reset() {
    setFile(null);
    setOrig(null);
    setOut(null);
    imgRef.current = null;
  }

  if (!orig)
    return (
      <div className="grid gap-5">
        <Dropzone
          onFiles={pick}
          multiple={false}
          accept="image/*,.heic,.heif"
          title="যে ছবিটি বড় করতে চান সেটি দিন"
          hint="ছোট লোগো, প্রোফাইল ছবি, পুরনো ছবি — সবচেয়ে ভালো ফল দেয়"
          formats={["JPG", "PNG", "WEBP", "HEIC"]}
        />
        <Card className="p-5 text-[15px] text-muted sm:p-6">
          <b className="text-forest-900">টিপস:</b> ২x আপস্কেল সবচেয়ে প্রাকৃতিক দেখায়। খুব ঝাপসা ছবিতে শার্পনেস ৪০–৭০% রাখুন। সব প্রসেসিং আপনার
          ফোন/কম্পিউটারেই হয়।
        </Card>
      </div>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
      <Card className="order-2 p-5 sm:p-6 lg:sticky lg:top-24 lg:order-1">
        <h2 className="text-lg font-bold text-forest-900">সেটিংস</h2>
        <div className="mt-4 grid gap-5">
          <div>
            <p className="label">কতগুণ বড় করবেন?</p>
            <Segmented
              label="স্কেল"
              value={scale}
              onChange={(v) => (setScale(v), setOut(null))}
              options={[2, 3, 4].map((v) => ({ value: v, label: `${toBn(v)}x` }))}
            />
          </div>
          <RangeField label="শার্পনেস" min={0} max={100} value={sharp} onChange={(v) => (setSharp(v), setOut(null))} display={`${toBn(sharp)}%`} />
          <Toggle checked={asJpg} onChange={(v) => (setAsJpg(v), setOut(null))} label="JPG হিসেবে সেভ করুন" hint="ফাইল সাইজ ছোট হবে (ট্রান্সপারেন্সি থাকবে না)" />

          <div className="rounded-2xl bg-leaf-soft p-4 text-[14px]">
            <div className="flex justify-between">
              <span className="text-muted">আসল মাপ</span>
              <b className="text-forest-900">
                {toBn(orig.w)}×{toBn(orig.h)}
              </b>
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-muted">নতুন মাপ</span>
              <b className={tooBig ? "text-danger" : "text-forest-700"}>
                {toBn(tw)}×{toBn(th)}
              </b>
            </div>
          </div>
          {tooBig && <p className="text-[13px] text-danger">এত বড় ছবি ব্রাউজারে প্রসেস করা নিরাপদ নয়। কম স্কেল বাছাই করুন।</p>}

          <Button size="lg" onClick={run} loading={busy} disabled={tooBig}>
            {!busy && <Sparkles className="size-5" />} {busy ? "প্রসেস হচ্ছে…" : "আপস্কেল করুন"}
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RefreshCw className="size-4" /> অন্য ছবি নিন
          </Button>
        </div>
      </Card>

      <div className="order-1 grid gap-4 lg:order-2">
        <AnimatePresence mode="wait">
          {out ? (
            <motion.div key="cmp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-4">
              <BeforeAfter before={orig.url} after={out.url} beforeLabel="আগে" afterLabel={`${toBn(scale)}x পরে`} />
              <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[15px] text-muted">
                  <b className="text-forest-900">
                    {toBn(out.w)}×{toBn(out.h)}
                  </b>{" "}
                  · {fmtBytes(out.blob.size)}
                </p>
                <Button
                  variant="sun"
                  onClick={() => downloadBlob(out.blob, `${baseName(file.name)}-${scale}x.${asJpg ? "jpg" : "png"}`)}
                >
                  <Download className="size-4" /> ডাউনলোড করুন
                </Button>
              </Card>
              <p className="text-center text-[13px] text-muted">স্লাইডার টেনে আগে-পরে তুলনা করুন</p>
            </motion.div>
          ) : (
            <motion.div key="prev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="checker relative grid min-h-64 place-items-center overflow-hidden rounded-2xl ring-1 ring-line">
                <img src={orig.url} alt="আসল ছবি" className={`max-h-[70vh] w-auto object-contain transition ${busy ? "scale-[1.02] blur-sm" : ""}`} />
                {busy && (
                  <div className="absolute inset-0 grid place-items-center bg-cream/40">
                    <motion.div
                      className="h-1.5 w-40 overflow-hidden rounded-full bg-white/80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="h-full w-1/3 rounded-full bg-forest-600"
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>
                )}
              </div>
              {!busy && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-muted">
                  <ImageOff className="size-4" /> এখনো আপস্কেল হয়নি — বাম পাশের বাটনে চাপুন
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

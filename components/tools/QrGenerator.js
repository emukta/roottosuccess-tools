"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Link2, Type, Phone, Wifi, Mail } from "lucide-react";
import { Button, Card, RangeField, Segmented } from "../ui";
import { useToast } from "../Providers";
import { downloadBlob } from "@/lib/image";
import { toBn } from "@/lib/format";

const TYPES = [
  { value: "url", label: "লিংক", icon: Link2 },
  { value: "text", label: "লেখা", icon: Type },
  { value: "phone", label: "ফোন", icon: Phone },
  { value: "wifi", label: "ওয়াইফাই", icon: Wifi },
  { value: "email", label: "ইমেইল", icon: Mail },
];

const escWifi = (s) => s.replace(/([\\;,:"])/g, "\\$1");

export function buildPayload(type, d) {
  switch (type) {
    case "url": {
      const u = d.url.trim();
      return u && !/^[a-z]+:\/\//i.test(u) ? `https://${u}` : u;
    }
    case "phone":
      return d.phone.trim() ? `tel:${d.phone.trim()}` : "";
    case "wifi":
      return d.ssid.trim() ? `WIFI:T:${d.enc};S:${escWifi(d.ssid)};P:${escWifi(d.pass)};;` : "";
    case "email":
      return d.email.trim() ? `mailto:${d.email.trim()}` : "";
    default:
      return d.text;
  }
}

export default function QrGenerator() {
  const toast = useToast();
  const [type, setType] = useState("url");
  const [data, setData] = useState({ url: "https://roottosuccess.com/", text: "", phone: "", ssid: "", pass: "", enc: "WPA", email: "" });
  const [fg, setFg] = useState("#0f2a18");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState(720);
  const [ecl, setEcl] = useState("M");
  const [png, setPng] = useState("");

  const payload = buildPayload(type, data);

  useEffect(() => {
    let alive = true;
    if (!payload) {
      setPng("");
      return;
    }
    const t = setTimeout(async () => {
      try {
        const QR = (await import("qrcode")).default;
        const url = await QR.toDataURL(payload, { errorCorrectionLevel: ecl, margin: 2, width: size, color: { dark: fg, light: bg } });
        if (alive) setPng(url);
      } catch {
        if (alive) setPng("");
      }
    }, 150);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [payload, fg, bg, size, ecl]);

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  async function downloadPng() {
    const blob = await (await fetch(png)).blob();
    downloadBlob(blob, `qr-code-${type}.png`);
    toast("PNG ডাউনলোড হয়েছে");
  }
  async function downloadSvg() {
    const QR = (await import("qrcode")).default;
    const svg = await QR.toString(payload, { type: "svg", errorCorrectionLevel: ecl, margin: 2, color: { dark: fg, light: bg } });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `qr-code-${type}.svg`);
    toast("SVG ডাউনলোড হয়েছে");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <Card className="p-5 sm:p-6">
        <p className="label">কিসের QR কোড?</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {TYPES.map((t) => {
            const on = t.value === type;
            const I = t.icon;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                aria-pressed={on}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-[14px] font-semibold transition ${
                  on ? "text-white" : "bg-paper text-forest-800 ring-1 ring-line hover:ring-forest-500"
                }`}
              >
                {on && (
                  <motion.span layoutId="qr-type" className="absolute inset-0 -z-0 rounded-2xl bg-forest-700" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
                )}
                <I className="relative size-5" />
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <AnimatePresence mode="wait">
            <motion.div key={type} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="grid gap-4">
              {type === "url" && (
                <div>
                  <label htmlFor="qr-url" className="label">ওয়েবসাইট / পেজ লিংক</label>
                  <input id="qr-url" className="field" value={data.url} onChange={set("url")} placeholder="https://facebook.com/আপনার-পেজ" inputMode="url" />
                </div>
              )}
              {type === "text" && (
                <div>
                  <label htmlFor="qr-text" className="label">লেখা</label>
                  <textarea id="qr-text" rows={4} className="field resize-y" value={data.text} onChange={set("text")} placeholder="যেকোনো লেখা…" />
                </div>
              )}
              {type === "phone" && (
                <div>
                  <label htmlFor="qr-phone" className="label">ফোন নাম্বার</label>
                  <input id="qr-phone" className="field" value={data.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" inputMode="tel" />
                </div>
              )}
              {type === "email" && (
                <div>
                  <label htmlFor="qr-email" className="label">ইমেইল</label>
                  <input id="qr-email" className="field" value={data.email} onChange={set("email")} placeholder="name@example.com" inputMode="email" />
                </div>
              )}
              {type === "wifi" && (
                <>
                  <div>
                    <label htmlFor="qr-ssid" className="label">ওয়াইফাই নাম (SSID)</label>
                    <input id="qr-ssid" className="field" value={data.ssid} onChange={set("ssid")} placeholder="যেমন: Shop_WiFi" />
                  </div>
                  <div>
                    <label htmlFor="qr-pass" className="label">পাসওয়ার্ড</label>
                    <input id="qr-pass" className="field" value={data.pass} onChange={set("pass")} placeholder="ওয়াইফাই পাসওয়ার্ড" />
                  </div>
                  <Segmented
                    label="নিরাপত্তা"
                    size="sm"
                    value={data.enc}
                    onChange={(v) => setData((d) => ({ ...d, enc: v }))}
                    options={[
                      { value: "WPA", label: "WPA/WPA2" },
                      { value: "WEP", label: "WEP" },
                      { value: "nopass", label: "পাসওয়ার্ড নেই" },
                    ]}
                  />
                  <p className="text-[13px] text-muted">দোকান বা অফিসে লাগিয়ে রাখুন — কাস্টমার স্ক্যান করলেই ওয়াইফাই কানেক্ট হবে।</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
          <ColorField label="QR এর রং" value={fg} onChange={setFg} />
          <ColorField label="ব্যাকগ্রাউন্ড" value={bg} onChange={setBg} />
          <RangeField label="সাইজ" min={256} max={2048} step={64} value={size} onChange={setSize} display={`${toBn(size)}px`} />
          <div>
            <p className="label">ত্রুটি সংশোধন</p>
            <Segmented
              label="ত্রুটি সংশোধন"
              size="sm"
              value={ecl}
              onChange={setEcl}
              options={[
                { value: "L", label: "কম" },
                { value: "M", label: "মাঝারি" },
                { value: "H", label: "বেশি" },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 lg:sticky lg:top-24">
        <div className="mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl ring-1 ring-line" style={{ background: bg }}>
          <AnimatePresence mode="wait">
            {png ? (
              <motion.img
                key={png.slice(-40)}
                src={png}
                alt="QR কোড প্রিভিউ"
                className="size-full"
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <motion.div key="empty" className="grid size-full place-items-center p-6 text-center text-[14px] text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                তথ্য লিখলে এখানে QR কোড দেখাবে
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button onClick={downloadPng} disabled={!png}>
            <Download className="size-4" /> PNG
          </Button>
          <Button variant="outline" onClick={downloadSvg} disabled={!png}>
            <Download className="size-4" /> SVG
          </Button>
        </div>
        {fg.toLowerCase() === bg.toLowerCase() && <p className="mt-3 text-center text-[13px] text-danger">QR ও ব্যাকগ্রাউন্ডের রং আলাদা রাখুন</p>}
        <p className="mt-3 text-center text-[13px] text-muted">প্রিন্টের জন্য SVG সবচেয়ে ভালো — যত বড়ই করুন ঝাপসা হবে না।</p>
      </Card>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <p className="label">{label}</p>
      <label className="field flex cursor-pointer items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="size-8 cursor-pointer rounded-lg border-0 bg-transparent p-0" aria-label={label} />
        <span className="font-mono text-[15px] uppercase text-forest-800">{value}</span>
      </label>
    </div>
  );
}

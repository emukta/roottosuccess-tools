"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, Download, Code2 } from "lucide-react";
import { Button, Card } from "../ui";
import { WhatsAppGlyph } from "../Icon";
import { useToast } from "../Providers";
import { downloadBlob } from "@/lib/image";
import { copyText, toEnDigits } from "@/lib/format";

const TEMPLATES = [
  "আসসালামু আলাইকুম, আমি আপনার পণ্যটি সম্পর্কে জানতে চাই।",
  "আমি অর্ডার করতে চাই। দাম ও ডেলিভারি চার্জ জানাবেন?",
  "আপনার সার্ভিস সম্পর্কে বিস্তারিত জানতে চাই।",
];

function toIntl(raw) {
  let d = toEnDigits(raw).replace(/\D/g, "");
  if (/^01\d{9}$/.test(d)) d = "88" + d;
  return d;
}

export default function WhatsAppLink() {
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState(TEMPLATES[0]);
  const [copied, setCopied] = useState("");
  const [qr, setQr] = useState("");

  const intl = toIntl(phone);
  const valid = intl.length >= 10 && intl.length <= 15;
  const link = valid ? `https://wa.me/${intl}${msg.trim() ? `?text=${encodeURIComponent(msg.trim())}` : ""}` : "";
  const button = link
    ? `<a href="${link}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:12px 20px;border-radius:12px;font-weight:600;text-decoration:none">WhatsApp এ মেসেজ দিন</a>`
    : "";

  useEffect(() => {
    let alive = true;
    if (!link) return setQr("");
    (async () => {
      const QR = (await import("qrcode")).default;
      const url = await QR.toDataURL(link, { margin: 2, width: 600, color: { dark: "#0f2a18", light: "#ffffff" } });
      if (alive) setQr(url);
    })().catch(() => {});
    return () => {
      alive = false;
    };
  }, [link]);

  async function copy(k, v) {
    if (await copyText(v)) {
      setCopied(k);
      toast("কপি হয়েছে");
      setTimeout(() => setCopied(""), 1500);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <Card className="grid gap-5 p-5 sm:p-6">
        <div>
          <label htmlFor="wa-phone" className="label">
            আপনার হোয়াটসঅ্যাপ নাম্বার
          </label>
          <input
            id="wa-phone"
            className="field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            inputMode="tel"
            aria-invalid={phone && !valid}
          />
          <p className="mt-1.5 text-[13px] text-muted">বাংলাদেশি নাম্বার দিলে স্বয়ংক্রিয়ভাবে ৮৮০ যোগ হবে।</p>
        </div>
        <div>
          <label htmlFor="wa-msg" className="label">
            আগে থেকে লেখা মেসেজ <span className="font-normal text-muted">(ঐচ্ছিক)</span>
          </label>
          <textarea id="wa-msg" rows={4} className="field resize-y" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <div className="mt-2 flex flex-wrap gap-2">
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMsg(t)}
                className="rounded-full bg-leaf-soft px-3 py-1.5 text-left text-[13px] font-semibold text-forest-800 transition hover:bg-forest-700 hover:text-white"
              >
                {t.slice(0, 26)}…
              </button>
            ))}
          </div>
        </div>

        <motion.div animate={{ opacity: link ? 1 : 0.5 }} className="grid gap-3 rounded-2xl bg-cream p-4 ring-1 ring-line">
          <p className="text-[13px] font-bold text-leaf">আপনার লিংক</p>
          <p className="break-all font-mono text-[14px] text-forest-900">{link || "নাম্বার দিলে এখানে লিংক তৈরি হবে"}</p>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button size="sm" onClick={() => copy("link", link)} disabled={!link}>
              {copied === "link" ? <Check className="size-4" /> : <Copy className="size-4" />} লিংক কপি
            </Button>
            <Button size="sm" variant="wa" as="a" href={link || undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!link} className={!link ? "pointer-events-none opacity-50" : ""}>
              <ExternalLink className="size-4" /> টেস্ট করুন
            </Button>
            <Button size="sm" variant="outline" onClick={() => copy("btn", button)} disabled={!link} className="col-span-2 sm:col-span-1">
              {copied === "btn" ? <Check className="size-4" /> : <Code2 className="size-4" />} ওয়েবসাইট বাটনের কোড
            </Button>
          </div>
        </motion.div>
      </Card>

      <Card className="p-5 text-center sm:p-6 lg:sticky lg:top-24">
        <div className="mx-auto grid aspect-square w-full max-w-[280px] place-items-center overflow-hidden rounded-3xl bg-white ring-1 ring-line">
          {qr ? (
            <motion.img key={qr.slice(-30)} src={qr} alt="হোয়াটসঅ্যাপ QR কোড" className="size-full" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} />
          ) : (
            <WhatsAppGlyph className="size-16 text-line-strong" />
          )}
        </div>
        <p className="mt-4 text-[14px] text-muted">দোকানে, প্যাকেটে বা ভিজিটিং কার্ডে এই QR প্রিন্ট করুন — স্ক্যান করলেই আপনার চ্যাট খুলবে।</p>
        <Button
          className="mt-4 w-full"
          variant="sun"
          disabled={!qr}
          onClick={async () => downloadBlob(await (await fetch(qr)).blob(), "whatsapp-qr.png")}
        >
          <Download className="size-4" /> QR ডাউনলোড
        </Button>
      </Card>
    </div>
  );
}

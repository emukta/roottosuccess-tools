"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Card, Segmented } from "../ui";
import { useToast } from "../Providers";
import { toBanglaWords, toEnglishWords, groupBD } from "@/lib/banglaNumber";
import { copyText, toBn, toEnDigits } from "@/lib/format";

export default function NumberToWords() {
  const toast = useToast();
  const [raw, setRaw] = useState("125000");
  const [mode, setMode] = useState("taka");
  const [copied, setCopied] = useState("");

  const clean = toEnDigits(raw).replace(/[,\s]/g, "");
  const valid = /^\d{1,21}(\.\d{0,2})?$/.test(clean);
  const currency = mode === "taka";

  const rows = useMemo(() => {
    if (!valid) return [];
    return [
      { key: "bn", label: "বাংলায় কথায়", value: toBanglaWords(clean, { currency }), big: true },
      { key: "en", label: "ইংরেজিতে কথায়", value: toEnglishWords(clean, { currency }), big: true },
      { key: "bnd", label: "বাংলা অঙ্কে", value: (currency ? "৳ " : "") + toBn(groupBD(clean)) },
      { key: "end", label: "ইংরেজি অঙ্কে", value: (currency ? "Tk. " : "") + groupBD(clean) },
    ];
  }, [clean, valid, currency]);

  async function copy(k, v) {
    if (await copyText(v)) {
      setCopied(k);
      toast("কপি হয়েছে");
      setTimeout(() => setCopied(""), 1500);
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <label htmlFor="num" className="label">
              সংখ্যা লিখুন (বাংলা বা ইংরেজি অঙ্কে)
            </label>
            <input
              id="num"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              inputMode="decimal"
              placeholder="যেমন: ১২৫০০০ বা 125000.50"
              className="field !min-h-14 font-display !text-2xl font-bold tracking-wide"
              aria-invalid={raw && !valid}
            />
          </div>
          <Segmented
            label="ধরন"
            value={mode}
            onChange={setMode}
            options={[
              { value: "taka", label: "টাকা" },
              { value: "plain", label: "সাধারণ সংখ্যা" },
            ]}
          />
        </div>
        {raw && !valid && <p className="mt-2 text-[13px] text-danger">শুধু অঙ্ক লিখুন (দশমিকের পর সর্বোচ্চ ২ ঘর)।</p>}
      </Card>

      <div className="grid gap-3">
        <AnimatePresence initial={false}>
          {rows.map((r, i) => (
            <motion.div key={r.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="flex items-start gap-3 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-leaf">{r.label}</p>
                  <motion.p
                    key={r.value}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    className={`mt-1 break-words font-semibold text-forest-900 ${r.big ? "text-lg sm:text-xl" : "text-base"}`}
                  >
                    {r.value}
                  </motion.p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(r.key, r.value)}
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-leaf-soft text-forest-700 hover:bg-forest-700 hover:text-white"
                  aria-label={`${r.label} কপি করুন`}
                >
                  {copied === r.key ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-center text-[13px] text-muted">বাংলাদেশি পদ্ধতিতে (হাজার, লক্ষ, কোটি) — চেক, ইনভয়েস ও মানি রিসিটে ব্যবহারের উপযোগী।</p>
    </div>
  );
}

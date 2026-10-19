"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Eraser, CaseUpper, CaseLower, Pilcrow } from "lucide-react";
import { Button, Card } from "../ui";
import { useToast } from "../Providers";
import { copyText, toBn } from "@/lib/format";

function analyze(text) {
  const t = text.trim();
  const words = t ? t.split(/\s+/).filter(Boolean) : [];
  const graphemes = typeof Intl !== "undefined" && Intl.Segmenter
    ? [...new Intl.Segmenter("bn", { granularity: "grapheme" }).segment(text)].length
    : [...text].length;
  const noSpace = typeof Intl !== "undefined" && Intl.Segmenter
    ? [...new Intl.Segmenter("bn", { granularity: "grapheme" }).segment(text.replace(/\s/g, ""))].length
    : [...text.replace(/\s/g, "")].length;
  const sentences = t ? t.split(/[।.!?]+(?:\s|$)/).filter((s) => s.trim()).length : 0;
  const paragraphs = t ? t.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const bn = words.filter((w) => /[ঀ-৿]/.test(w)).length;
  const freq = {};
  for (const w of words) {
    const k = w.replace(/[।,.!?;:"'()\[\]{}“”‘’\-]/g, "").toLowerCase();
    if (k.length > 1) freq[k] = (freq[k] || 0) + 1;
  }
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const minutes = Math.max(1, Math.round(words.length / 180));
  return { words: words.length, graphemes, noSpace, sentences, paragraphs, bn, en: words.length - bn, top, minutes };
}

export default function WordCounter() {
  const toast = useToast();
  const [text, setText] = useState("");
  const s = useMemo(() => analyze(text), [text]);

  const stats = [
    ["শব্দ", s.words],
    ["অক্ষর", s.graphemes],
    ["স্পেস ছাড়া অক্ষর", s.noSpace],
    ["বাক্য", s.sentences],
    ["অনুচ্ছেদ", s.paragraphs],
    ["পড়তে সময় (মিনিট)", text.trim() ? s.minutes : 0],
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b border-line p-2">
          <Button size="sm" variant="ghost" onClick={() => setText((t) => t.toUpperCase())}>
            <CaseUpper className="size-4" /> UPPER
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setText((t) => t.toLowerCase())}>
            <CaseLower className="size-4" /> lower
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setText((t) => t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim())}>
            <Pilcrow className="size-4" /> বাড়তি স্পেস মুছুন
          </Button>
          <div className="ml-auto flex gap-1">
            <Button size="sm" variant="ghost" onClick={async () => text && (await copyText(text)) && toast("কপি হয়েছে")} aria-label="কপি">
              <Copy className="size-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setText("")} aria-label="মুছুন">
              <Eraser className="size-4" />
            </Button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="এখানে আপনার লেখা টাইপ বা পেস্ট করুন — সাথে সাথে হিসাব দেখবেন…"
          className="min-h-72 w-full resize-y bg-transparent p-5 text-[17px] leading-relaxed outline-none placeholder:text-muted/70 sm:min-h-96"
          aria-label="লেখা"
        />
      </Card>

      <div className="grid gap-4 lg:sticky lg:top-24">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(([label, n]) => (
            <Card key={label} className="p-4">
              <motion.p key={n} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="font-display text-3xl font-bold text-forest-700">
                {toBn(n)}
              </motion.p>
              <p className="mt-0.5 text-[13px] font-semibold text-muted">{label}</p>
            </Card>
          ))}
        </div>
        <Card className="p-4">
          <p className="text-[14px] font-bold text-forest-900">ভাষা অনুযায়ী শব্দ</p>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-line">
            <motion.div className="bg-forest-600" animate={{ width: s.words ? `${(s.bn / s.words) * 100}%` : "0%" }} />
            <motion.div className="bg-sun" animate={{ width: s.words ? `${(s.en / s.words) * 100}%` : "0%" }} />
          </div>
          <div className="mt-2 flex justify-between text-[13px] text-muted">
            <span>● বাংলা {toBn(s.bn)}</span>
            <span>● ইংরেজি/অন্যান্য {toBn(s.en)}</span>
          </div>
        </Card>
        {s.top.length > 0 && (
          <Card className="p-4">
            <p className="text-[14px] font-bold text-forest-900">বেশি ব্যবহৃত শব্দ</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.top.map(([w, c]) => (
                <span key={w} className="rounded-lg bg-leaf-soft px-2 py-1 text-[13px] font-semibold text-forest-800">
                  {w} <span className="text-muted">×{toBn(c)}</span>
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

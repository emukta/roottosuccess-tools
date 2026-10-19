"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ArrowDown, ArrowUp, Copy, Check, Eraser, FileText, Info } from "lucide-react";
import { Button, Card } from "../ui";
import { useToast } from "../Providers";
import { bijoyToUnicode, unicodeToBijoy } from "@/lib/bijoy";
import { copyText, toBn } from "@/lib/format";

const SAMPLE = "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। বাংলাদেশের স্বাধীনতা ও সংস্কৃতি আমাদের গর্ব।";

function count(s) {
  const t = s.trim();
  return t ? t.split(/\s+/).length : 0;
}

export default function BijoyUnicode() {
  const toast = useToast();
  const [uni, setUni] = useState("");
  const [bij, setBij] = useState("");
  const [copied, setCopied] = useState("");
  const [flash, setFlash] = useState("");

  const pulse = (side) => {
    setFlash(side);
    setTimeout(() => setFlash(""), 600);
  };

  function toBijoy() {
    if (!uni.trim()) return toast("ইউনিকোড ঘরে লেখা দিন", "error");
    setBij(unicodeToBijoy(uni));
    pulse("bij");
    toast("বিজয়ে কনভার্ট হয়েছে");
  }
  function toUnicode() {
    if (!bij.trim()) return toast("বিজয় ঘরে লেখা দিন", "error");
    setUni(bijoyToUnicode(bij));
    pulse("uni");
    toast("ইউনিকোডে কনভার্ট হয়েছে");
  }
  async function copy(side) {
    const text = side === "uni" ? uni : bij;
    if (!text) return;
    if (await copyText(text)) {
      setCopied(side);
      toast("কপি হয়েছে");
      setTimeout(() => setCopied(""), 1600);
    }
  }

  const Panel = ({ side, title, sub, value, setValue, placeholder, bijoy }) => (
    <Card
      className={`flex flex-col overflow-hidden transition-shadow duration-500 ${
        flash === side ? "shadow-[0_0_0_4px_rgb(245_179_26/0.45)]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <h2 className="font-bold text-forest-900">{title}</h2>
          <p className="text-[12px] text-muted">{sub}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-1 hidden text-[12px] text-muted sm:inline">{toBn(count(value))} শব্দ</span>
          <button
            type="button"
            onClick={() => copy(side)}
            disabled={!value}
            className="grid size-10 place-items-center rounded-xl text-forest-700 hover:bg-leaf-soft disabled:opacity-40"
            aria-label={`${title} কপি করুন`}
          >
            {copied === side ? <Check className="size-[18px]" /> : <Copy className="size-[18px]" />}
          </button>
          <button
            type="button"
            onClick={() => setValue("")}
            disabled={!value}
            className="grid size-10 place-items-center rounded-xl text-muted hover:bg-danger/5 hover:text-danger disabled:opacity-40"
            aria-label={`${title} মুছুন`}
          >
            <Eraser className="size-[18px]" />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        aria-label={title}
        className={`min-h-56 w-full flex-1 resize-y bg-transparent p-4 leading-relaxed text-ink outline-none placeholder:text-muted/70 sm:min-h-80 ${
          bijoy ? "font-bijoy text-[18px]" : "text-[17px]"
        }`}
      />
    </Card>
  );

  return (
    <div className="grid gap-5">
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        {Panel({
          side: "uni",
          title: "ইউনিকোড",
          sub: "অভ্র, গুগল, মোবাইল কিবোর্ডের লেখা",
          value: uni,
          setValue: setUni,
          placeholder: "ইউনিকোডে লেখা এখানে পেস্ট করুন…",
        })}

        <div className="flex flex-row items-center justify-center gap-2 lg:flex-col">
          <motion.div whileTap={{ scale: 0.95 }} className="flex-1 lg:flex-none">
            <Button onClick={toBijoy} className="w-full lg:w-40">
              বিজয় <ArrowRight className="hidden size-4 lg:block" />
              <ArrowDown className="size-4 lg:hidden" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className="flex-1 lg:flex-none">
            <Button onClick={toUnicode} variant="sun" className="w-full lg:w-40">
              <ArrowLeft className="hidden size-4 lg:block" />
              <ArrowUp className="size-4 lg:hidden" /> ইউনিকোড
            </Button>
          </motion.div>
          <Button
            variant="outline"
            className="lg:w-40"
            onClick={() => (setUni(""), setBij(""))}
            aria-label="দুই ঘরই মুছুন"
          >
            <Eraser className="size-4" /> <span className="hidden sm:inline">মুছে ফেলুন</span>
          </Button>
        </div>

        {Panel({
          side: "bij",
          title: "বিজয় (SutonnyMJ)",
          sub: "বিজয় কিবোর্ড / পুরনো ডকুমেন্টের লেখা",
          value: bij,
          setValue: setBij,
          placeholder: "বিজয় ফন্টের লেখা এখানে পেস্ট করুন…",
          bijoy: true,
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setUni(SAMPLE)}>
          <FileText className="size-4" /> উদাহরণ লেখা দিন
        </Button>
      </div>

      <Card className="flex gap-3 p-5 text-[15px] text-muted">
        <Info className="mt-0.5 size-5 shrink-0 text-sun-deep" />
        <div>
          <b className="text-forest-900">বিজয় লেখা ঠিকমতো দেখতে</b> আপনার কম্পিউটারে <b>SutonnyMJ</b> ফন্ট থাকতে হবে। না থাকলে ডান পাশে ইংরেজি
          অক্ষরের মতো দেখাবে — এটাই স্বাভাবিক। কপি করে MS Word / Photoshop এ SutonnyMJ ফন্ট সিলেক্ট করলেই সঠিক বাংলা দেখাবে।
        </div>
      </Card>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Lock, Check, Download, Sparkles, FileImage, TrendingDown } from "lucide-react";
import { ToolIcon } from "../Icon";
import { toBn } from "@/lib/format";
import { TOOLS } from "@/lib/tools";

const ease = [0.22, 1, 0.36, 1];

// Demo rows shown inside the product window (illustrative only)
const FILES = [
  { name: "product-01.heic", from: "HEIC", to: "WEBP", before: "৪.২ MB", after: "৬১২ KB", tint: "from-[#ffd36b] to-[#f08a24]", d: 0 },
  { name: "facebook-cover.png", from: "PNG", to: "WEBP", before: "২.৮ MB", after: "৩৮৬ KB", tint: "from-[#9be15d] to-[#1b7a3e]", d: 0.35 },
  { name: "profile-photo.jpg", from: "JPG", to: "WEBP", before: "১.৬ MB", after: "২৪০ KB", tint: "from-[#7cc5ff] to-[#4a5bd8]", d: 0.7 },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
  };
  const sidebar = TOOLS.slice(0, 6);

  return (
    <section className="relative isolate -mt-[72px] overflow-hidden bg-night pt-[72px] text-white">
      {/* Atmosphere */}
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-280px] -z-10 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(180_242_92/0.22),transparent)]" />
      <div className="pointer-events-none absolute -left-40 top-[40%] -z-10 size-[520px] rounded-full bg-forest-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-[30%] -z-10 size-[460px] rounded-full bg-sun/10 blur-[120px]" />

      <div className="container-x relative pb-10 pt-12 text-center sm:pt-20">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={item}>
            <Link
              href="/tools/image-upscaler/"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-[14px] font-medium text-white/80 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10 hover:text-white"
            >
              <span className="rounded-full bg-lime px-2.5 py-0.5 text-[12px] font-bold text-night">নতুন</span>
              ইমেজ আপস্কেলার — ছবি বড় করুন ৪x পর্যন্ত
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.h1
            variants={item}
            className="display mx-auto mt-8 max-w-5xl text-[40px] font-bold sm:text-7xl lg:text-[92px] lg:leading-[1.04]"
          >
            প্রতিদিনের দরকারি টুল,
            <br />
            <span className="text-gradient">এক জায়গায়, একদম ফ্রি।</span>
          </motion.h1>

          <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/60 sm:text-xl">
            ছবি কনভার্ট, মেটাডাটা ক্লিন, ছবি বড় করা, বিজয়-ইউনিকোড, QR কোড — সব কাজ সরাসরি আপনার ব্রাউজারে। ফাইল কোথাও যায় না,
            তাই একদম নিরাপদ।
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="#tools"
              className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-lime px-8 text-[17px] font-semibold text-night shadow-glow transition hover:bg-lime-deep active:scale-[0.98]"
            >
              ফ্রি টুলস ব্যবহার করুন
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/audit/"
              className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full px-8 text-[17px] font-semibold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/[0.06] active:scale-[0.98]"
            >
              ফ্রি পেজ অডিট নিন
              <ArrowUpRight className="size-5 text-white/60 transition group-hover:text-lime" />
            </Link>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] font-medium text-white/55"
          >
            {[`${toBn(TOOLS.length)}টি ফ্রি টুল`, "কোনো লগইন নেই", "ফাইল আপলোড হয় না", "মোবাইলেও পারফেক্ট"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-lime" aria-hidden="true" /> {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Product window */}
        <div className="relative mx-auto mt-16 max-w-5xl [perspective:1800px] sm:mt-20" aria-hidden="true">
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.3, ease, delay: 0.35 }}
            className="relative rounded-[22px] bg-gradient-to-b from-white/20 to-white/[0.04] p-px shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.04)] sm:rounded-[28px]"
          >
            <div className="overflow-hidden rounded-[21px] bg-[#0c1711] text-left sm:rounded-[27px]">
              {/* Window chrome */}
              <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-[12px] text-white/45 ring-1 ring-white/[0.06]">
                  <Lock className="size-3 text-lime" /> tools.roottosuccess.com
                </div>
                <span className="w-[42px]" />
              </div>

              <div className="grid md:grid-cols-[220px_1fr]">
                {/* Sidebar */}
                <div className="hidden border-r border-white/[0.07] p-3 md:block">
                  <p className="px-2 pb-2 pt-1 text-[12px] font-semibold text-white/35">টুলস</p>
                  {sidebar.map((t, i) => (
                    <div
                      key={t.slug}
                      className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium ${
                        i === 0 ? "bg-white/[0.07] text-white ring-1 ring-white/[0.08]" : "text-white/50"
                      }`}
                    >
                      <span
                        className={`grid size-7 place-items-center rounded-lg ${i === 0 ? "bg-lime text-night" : "bg-white/[0.05] text-white/60"}`}
                      >
                        <ToolIcon name={t.icon} className="size-[15px]" />
                      </span>
                      <span className="truncate">{t.name}</span>
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="display text-[19px] font-semibold text-white sm:text-[22px]">ইমেজ ফরম্যাট কনভার্টার</p>
                      <p className="text-[13px] text-white/45">৩টি ছবি · সব কাজ আপনার ব্রাউজারে</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white/[0.05] p-1 text-[12px] font-semibold ring-1 ring-white/[0.07]">
                      {["JPG", "PNG", "WEBP", "AVIF"].map((f) => (
                        <span key={f} className={`rounded-full px-3 py-1 ${f === "WEBP" ? "bg-lime text-night" : "text-white/50"}`}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2.5">
                    {FILES.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center gap-3 rounded-2xl bg-white/[0.035] p-2.5 ring-1 ring-white/[0.06] sm:gap-4 sm:p-3"
                      >
                        <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${f.tint} sm:size-12`}>
                          <FileImage className="size-5 text-white/90" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13px] font-semibold text-white sm:text-[14px]">{f.name}</p>
                            <p className="shrink-0 text-[12px] text-white/45">
                              <span className="line-through decoration-white/30">{f.before}</span>
                              <span className="mx-1">→</span>
                              <span className="font-semibold text-lime">{f.after}</span>
                            </p>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                            <div
                              className="h-full origin-left animate-grow rounded-full bg-gradient-to-r from-forest-500 to-lime"
                              style={{ animationDelay: `${0.9 + f.d}s` }}
                            />
                          </div>
                        </div>
                        <span className="hidden shrink-0 items-center gap-1 rounded-full bg-lime/10 px-2.5 py-1 text-[12px] font-semibold text-lime ring-1 ring-lime/20 sm:inline-flex">
                          <Check className="size-3.5" /> সম্পন্ন
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                    <p className="flex items-center gap-2 text-[13px] text-white/50">
                      <span className="size-2 animate-pulse-dot rounded-full bg-lime" />
                      মোট সাইজ কমেছে <span className="font-semibold text-white">৮৫%</span>
                    </p>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-night">
                      <Download className="size-4" /> সব ডাউনলোড (ZIP)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.1 }}
            className="absolute -left-10 bottom-16 hidden lg:block"
          >
            <div className={`${reduce ? "" : "animate-float"} flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 text-left text-ink shadow-lift`}>
              <span className="grid size-10 place-items-center rounded-xl bg-forest-900 text-lime">
                <Lock className="size-5" />
              </span>
              <span>
                <span className="block text-[14px] font-bold">১০০% প্রাইভেট</span>
                <span className="block text-[12px] text-muted">ফাইল সার্ভারে যায় না</span>
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.3 }}
            className="absolute -right-12 -top-10 hidden lg:block"
          >
            <div
              className={`${reduce ? "" : "animate-float [animation-delay:1.5s]"} rounded-2xl bg-white p-4 text-left text-ink shadow-lift`}
            >
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
                <TrendingDown className="size-4 text-forest-600" /> ফাইল সাইজ
              </span>
              <span className="display mt-1 block text-[34px] font-bold leading-none text-ink">−৮৫%</span>
              <span className="mt-2 flex h-8 items-end gap-1">
                {[90, 72, 58, 40, 26, 15].map((h, i) => (
                  <span
                    key={i}
                    className={`w-3 rounded-sm ${i === 5 ? "bg-lime-deep" : "bg-forest-900/10"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.5 }}
            className="absolute -bottom-6 right-12 hidden lg:block"
          >
            <div className="flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-[13px] font-bold text-night shadow-glow">
              <Sparkles className="size-4" /> লগইন ছাড়াই, চিরকাল ফ্রি
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tool marquee */}
      <div className="relative border-t border-white/[0.07] py-6">
        <div className="mask-fade-x flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-3 pr-3 hover:[animation-play-state:paused]">
            {[...TOOLS, ...TOOLS].map((t, i) => (
              <Link
                key={`${t.slug}-${i}`}
                href={`/tools/${t.slug}/`}
                tabIndex={i >= TOOLS.length ? -1 : undefined}
                aria-hidden={i >= TOOLS.length || undefined}
                className="flex shrink-0 items-center gap-2.5 rounded-full bg-white/[0.04] py-2 pl-2 pr-4 text-[14px] font-medium text-white/70 ring-1 ring-white/[0.08] transition hover:bg-white/10 hover:text-white"
              >
                <span className="grid size-7 place-items-center rounded-full bg-white/[0.07] text-lime">
                  <ToolIcon name={t.icon} className="size-[15px]" />
                </span>
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

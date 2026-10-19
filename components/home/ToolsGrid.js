"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowUpRight, SearchX, Plus } from "lucide-react";
import { ToolIcon, CATEGORY_STYLE, WhatsAppGlyph } from "../Icon";
import { Segmented, Eyebrow } from "../ui";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { toBn } from "@/lib/format";
import { waLink } from "@/lib/site";

export default function ToolsGrid() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return TOOLS.filter(
      (t) => (cat === "all" || t.category === cat) && (!s || `${t.name} ${t.en} ${t.desc} ${t.keywords}`.toLowerCase().includes(s))
    );
  }, [cat, q]);

  return (
    <section id="tools" className="relative scroll-mt-20 border-t border-line bg-paper py-20 sm:py-28">
      <div className="grid-lines-dark pointer-events-none absolute inset-x-0 top-0 h-[420px] [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>ফ্রি টুলস</Eyebrow>
            <h2 className="display mt-5 text-[34px] font-bold text-ink sm:text-5xl lg:text-[56px]">আপনার কাজের টুলটি বেছে নিন</h2>
          </div>
          <p className="max-w-sm text-[17px] leading-relaxed text-muted">
            সব টুল সম্পূর্ণ ফ্রি, কোনো অ্যাকাউন্ট লাগবে না। মোবাইল ও কম্পিউটার — দুই জায়গাতেই চলে।
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Segmented
            label="ক্যাটাগরি"
            options={CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
            value={cat}
            onChange={setCat}
          />
          <div className="relative sm:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="টুল খুঁজুন… (যেমন: QR, বিজয়)"
              className="field !rounded-full pl-11 shadow-card"
              aria-label="টুল খুঁজুন"
            />
          </div>
        </div>

        <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((t, i) => {
              const s = CATEGORY_STYLE[t.category];
              return (
                <motion.div
                  key={t.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full"
                  >
                    <Link
                      href={`/tools/${t.slug}/`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-cream/60 p-5 sm:p-6 ring-1 ring-line transition-[transform,box-shadow,background-color] duration-500 ease-out-quint hover:-translate-y-1 hover:bg-paper hover:shadow-lift hover:ring-ink/10"
                    >
                      <span
                        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-lime/0 blur-3xl transition-colors duration-500 group-hover:bg-lime/30"
                        aria-hidden="true"
                      />
                      <div className="relative flex items-center gap-4 sm:items-start sm:justify-between">
                        <span
                          className={`grid size-12 shrink-0 place-items-center rounded-2xl sm:size-14 ${s.bg} ${s.fg} ring-1 ring-black/[0.03] transition-transform duration-500 ease-out-quint group-hover:scale-105 group-hover:-rotate-6`}
                        >
                          <ToolIcon name={t.icon} className="size-7" />
                        </span>
                        <h3 className="display min-w-0 flex-1 text-[20px] font-bold leading-snug text-ink sm:hidden">{t.name}</h3>
                        {t.badge && (
                          <span className="hidden rounded-full sm:inline bg-paper px-2.5 py-1 text-[12px] font-semibold text-forest-700 ring-1 ring-line">
                            {t.badge}
                          </span>
                        )}
                      </div>
                      <p className="relative mt-6 hidden text-[11px] sm:block font-semibold uppercase tracking-[0.16em] text-muted/80">{t.en}</p>
                      <h3 className="display relative mt-1.5 hidden text-[23px] sm:block font-bold leading-snug text-ink">{t.name}</h3>
                      <p className="relative mt-3 line-clamp-2 flex-1 text-[15px] leading-relaxed text-muted sm:mt-2 sm:line-clamp-none">{t.desc}</p>
                      <span className="relative mt-6 hidden items-center justify-between border-t sm:flex border-line pt-4 text-[15px] font-semibold text-ink">
                        ব্যবহার করুন
                        <span className="grid size-9 place-items-center rounded-full bg-paper text-ink ring-1 ring-line transition-all duration-300 group-hover:bg-forest-900 group-hover:text-lime group-hover:ring-forest-900">
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
            {cat === "all" && !q.trim() && (
              <motion.div key="__request" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sm:col-span-2 lg:col-span-2">
                <a
                  href={waLink("আসসালামু আলাইকুম, আমি একটা নতুন টুলের আইডিয়া দিতে চাই: ")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative isolate flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-[24px] bg-night p-6 text-white sm:p-8"
                >
                  <span className="grid-lines pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_90%_10%,#000,transparent_70%)]" aria-hidden="true" />
                  <span className="pointer-events-none absolute -right-10 -top-10 -z-10 size-56 rounded-full bg-lime/20 blur-3xl transition-opacity duration-500" aria-hidden="true" />
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 text-[13px] font-semibold text-lime ring-1 ring-white/10">
                    <Plus className="size-4" aria-hidden="true" /> আরও টুল আসছে
                  </span>
                  <span className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <span>
                      <span className="display block text-[28px] font-bold sm:text-[34px]">কোন টুলটা আপনার দরকার?</span>
                      <span className="mt-2 block max-w-md text-[15px] text-white/60">আইডিয়া জানান — দরকারি হলে পরের টুলটা আপনার জন্যই বানাব, একদম ফ্রি।</span>
                    </span>
                    <span className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-lime px-5 text-[15px] font-semibold text-night transition group-hover:bg-lime-deep sm:self-auto">
                      <WhatsAppGlyph className="size-5" /> আইডিয়া পাঠান
                    </span>
                  </span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {!list.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-col items-center rounded-[24px] bg-cream p-12 text-center ring-1 ring-line"
            >
              <SearchX className="size-10 text-muted" />
              <p className="mt-3 font-semibold text-ink">“{q}” নামে কোনো টুল পাওয়া যায়নি</p>
              <button
                type="button"
                onClick={() => (setQ(""), setCat("all"))}
                className="mt-2 text-[15px] font-semibold text-forest-700 underline"
              >
                সব টুল দেখুন
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-[14px] text-muted">
          <span className="size-2 animate-pulse-dot rounded-full bg-lime-deep" aria-hidden="true" />
          মোট {toBn(TOOLS.length)}টি টুল · নতুন টুল নিয়মিত যোগ হচ্ছে
        </p>
      </div>
    </section>
  );
}

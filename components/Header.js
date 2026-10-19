"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { TOOLS } from "@/lib/tools";
import { ToolIcon } from "./Icon";

const NAV = [
  { href: "/#tools", label: "সব টুলস" },
  { href: "/audit/", label: "ফ্রি পেজ অডিট" },
  { href: "/#why", label: "কেন আমরা" },
  { href: "/#faq", label: "প্রশ্নোত্তর" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Home page starts on a dark hero → header is light-on-dark until the user scrolls.
  const onDark = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        onDark
          ? "bg-transparent"
          : scrolled || open
            ? "bg-white/80 shadow-[0_1px_0_rgb(11_19_14/0.08)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo dark={onDark} />

        <nav
          aria-label="মূল মেনু"
          className={`hidden items-center gap-0.5 rounded-full p-1 md:flex ${
            onDark ? "bg-white/[0.06] ring-1 ring-white/10 backdrop-blur" : "bg-ink/[0.03] ring-1 ring-ink/[0.06]"
          }`}
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                onDark ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-ink/70 hover:bg-white hover:text-ink hover:shadow-sm"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/audit/"
            className={`group hidden h-11 items-center gap-2 rounded-full pl-5 pr-1.5 text-[15px] font-semibold transition-colors sm:inline-flex ${
              onDark ? "bg-lime text-night hover:bg-lime-deep" : "bg-forest-900 text-white hover:bg-forest-800"
            }`}
          >
            ফ্রি অডিট নিন
            <span
              className={`grid size-8 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 ${
                onDark ? "bg-night text-lime" : "bg-lime text-night"
              }`}
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            className={`grid size-11 place-items-center rounded-full md:hidden ${
              onDark ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-paper text-ink ring-1 ring-line"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "m"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-white md:hidden"
          >
            <motion.nav
              aria-label="মোবাইল মেনু"
              className="container-x py-5"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
            >
              {NAV.map((n) => (
                <motion.div key={n.href} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-center justify-between border-b border-line py-4 text-[26px] font-semibold text-ink"
                  >
                    {n.label}
                    <ArrowUpRight className="size-6 text-forest-600" aria-hidden="true" />
                  </Link>
                </motion.div>
              ))}

              <p className="mb-3 mt-7 text-[13px] font-semibold text-muted">টুলস</p>
              <div className="grid grid-cols-2 gap-2">
                {TOOLS.map((t) => (
                  <motion.div key={t.slug} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                    <Link
                      href={`/tools/${t.slug}/`}
                      onClick={() => setOpen(false)}
                      className="flex h-full items-center gap-2.5 rounded-2xl bg-cream p-3 text-[14px] font-semibold leading-snug text-ink ring-1 ring-line"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-forest-700 ring-1 ring-line">
                        <ToolIcon name={t.icon} className="size-[18px]" />
                      </span>
                      {t.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/audit/"
                onClick={() => setOpen(false)}
                className="mt-6 flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-forest-900 text-base font-semibold text-white"
              >
                ফ্রি পেজ অডিট নিন <ArrowRight className="size-4" />
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

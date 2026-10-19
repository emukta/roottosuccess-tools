import Link from "next/link";
import { ChevronRight, Lock, Smartphone, BadgeCheck, ArrowRight, ArrowUpRight } from "lucide-react";
import { ToolIcon, CATEGORY_STYLE } from "./Icon";
import Reveal from "./Reveal";
import { TOOLS } from "@/lib/tools";

export default function ToolShell({ tool, children }) {
  const style = CATEGORY_STYLE[tool.category];
  const related = TOOLS.filter((t) => t.slug !== tool.slug)
    .sort((a, b) => (a.category === tool.category ? -1 : 0) - (b.category === tool.category ? -1 : 0))
    .slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="grid-lines-dark pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_100%_at_50%_0%,#000_30%,transparent_80%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[-240px] -z-10 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(180_242_92/0.28),transparent)]" />
        <div className="container-x relative pb-8 pt-6 sm:pb-12 sm:pt-10">
          <nav
            aria-label="ব্রেডক্রাম্ব"
            className="inline-flex max-w-full items-center gap-1 rounded-full bg-paper/80 px-3 py-1.5 text-[13px] text-muted ring-1 ring-line backdrop-blur"
          >
            <Link href="/" className="hover:text-ink">
              হোম
            </Link>
            <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
            <Link href="/#tools" className="hover:text-ink">
              টুলস
            </Link>
            <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate font-semibold text-ink">{tool.name}</span>
          </nav>

          <Reveal className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <span
              className={`grid size-[72px] shrink-0 place-items-center rounded-[22px] ${style.bg} ${style.fg} shadow-card ring-1 ring-black/[0.04]`}
            >
              <ToolIcon name={tool.icon} className="size-9" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">{tool.en}</p>
              <h1 className="display mt-1 text-[34px] font-bold text-ink sm:text-5xl">{tool.name}</h1>
              <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-muted sm:text-[17px]">{tool.desc}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="mt-6 flex flex-wrap gap-2">
            {[
              [Lock, "ফাইল আপলোড হয় না"],
              [BadgeCheck, "১০০% ফ্রি"],
              [Smartphone, "মোবাইলেও চলে"],
            ].map(([I, t]) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[13px] font-semibold text-ink ring-1 ring-line"
              >
                <I className="size-4 text-forest-600" aria-hidden="true" /> {t}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-20">
        <Reveal delay={0.12}>{children}</Reveal>

        <div className="relative isolate mt-16 overflow-hidden rounded-[28px] bg-night p-7 text-white sm:p-10 lg:p-12">
          <div className="grid-lines pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_90%_0%,#000,transparent_70%)]" />
          <div className="pointer-events-none absolute -right-20 -top-20 -z-10 size-80 rounded-full bg-lime/20 blur-[100px]" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[14px] font-semibold text-lime">ব্যবসা আছে?</p>
              <h2 className="display mt-2 text-[28px] font-bold sm:text-4xl">আপনার ফেসবুক পেজের ফ্রি অডিট নিন</h2>
              <p className="mt-3 max-w-xl text-white/60">
                কী কী করলে আপনার বিজনেস গ্রোথ হবে — Roottosuccess টিম পেজ দেখে বিস্তারিত জানাবে, একদম ফ্রি।
              </p>
            </div>
            <Link
              href="/audit/"
              className="group inline-flex min-h-[54px] shrink-0 items-center justify-center gap-2 rounded-full bg-lime px-7 font-semibold text-night shadow-glow transition hover:bg-lime-deep"
            >
              ফ্রি অডিট নিন <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display text-[28px] font-bold text-ink sm:text-[34px]">আরও দরকারি টুল</h2>
            <Link href="/#tools" className="hidden items-center gap-1 text-[15px] font-semibold text-forest-700 hover:underline sm:inline-flex">
              সব টুল <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => {
              const s = CATEGORY_STYLE[t.category];
              return (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}/`}
                  className="group flex items-start gap-4 rounded-[22px] bg-paper p-5 ring-1 ring-line transition duration-500 ease-out-quint hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${s.bg} ${s.fg}`}>
                    <ToolIcon name={t.icon} className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="display block text-[18px] font-bold text-ink">{t.name}</span>
                    <span className="mt-1 line-clamp-2 block text-sm text-muted">{t.desc}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-ink/25 transition group-hover:rotate-45 group-hover:text-forest-700" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

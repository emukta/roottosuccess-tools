import Link from "next/link";
import { Lock, Zap, Smartphone, Monitor, Tablet, ArrowUpRight, Check, ShieldCheck, MessageCircle } from "lucide-react";
import Hero from "@/components/home/Hero";
import ToolsGrid from "@/components/home/ToolsGrid";
import Faq from "@/components/home/Faq";
import TrustSection from "@/components/home/TrustSection";
import AuditForm from "@/components/AuditForm";
import Reveal from "@/components/Reveal";
import { SectionHeading, Eyebrow } from "@/components/ui";
import { WhatsAppGlyph } from "@/components/Icon";
import { waLink } from "@/lib/site";

const AUDIT_POINTS = [
  "পেজের ব্র্যান্ডিং ও প্রোফাইল সেটআপ রিভিউ",
  "কনটেন্ট স্ট্র্যাটেজি — কী পোস্ট করলে রিচ ও সেল বাড়বে",
  "বুস্ট/অ্যাডের টাকা কোথায় নষ্ট হচ্ছে",
  "ইনবক্স থেকে অর্ডারে কনভার্শন বাড়ানোর উপায়",
];

function Bento() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="কেন এই টুলস"
          title="দ্রুত, প্রাইভেট আর চিরকাল ফ্রি"
          desc="অন্য সাইটে ছবি আপলোড করতে হয়, অপেক্ষা করতে হয়, লিমিট থাকে। এখানে কোনোটাই নেই।"
        />

        <div className="mt-14 grid gap-4 md:grid-cols-6 lg:grid-rows-[auto_auto]">
          {/* Privacy — hero tile */}
          <Reveal className="md:col-span-6 lg:col-span-3 lg:row-span-2">
            <div className="relative isolate flex h-full min-h-[380px] flex-col justify-between overflow-hidden rounded-[28px] bg-forest-900 p-7 text-white sm:p-9">
              <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(circle_at_70%_40%,#000,transparent_70%)]" />
              <div className="pointer-events-none absolute right-[-60px] top-[-40px] -z-10 grid size-[360px] place-items-center" aria-hidden="true">
                {[1, 0.78, 0.56].map((s, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full ring-1 ring-lime/20"
                    style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
                  />
                ))}
                <span className="grid size-24 place-items-center rounded-[28px] bg-lime text-night shadow-glow">
                  <Lock className="size-10" strokeWidth={2.2} />
                </span>
              </div>
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 text-[13px] font-semibold text-lime ring-1 ring-white/10">
                <ShieldCheck className="size-4" aria-hidden="true" /> সম্পূর্ণ প্রাইভেট
              </p>
              <div className="mt-36 sm:mt-48">
                <h3 className="display text-[30px] font-bold sm:text-[40px]">আপনার ফাইল, আপনার ডিভাইসেই থাকে।</h3>
                <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/60">
                  ফাইল কোনো সার্ভারে যায় না। সব প্রসেসিং আপনার ব্রাউজারেই হয় — তাই ব্যক্তিগত ছবিও সম্পূর্ণ নিরাপদ।
                </p>
              </div>
            </div>
          </Reveal>

          {/* Free */}
          <Reveal delay={0.06} className="md:col-span-3 lg:col-span-1">
            <div className="flex h-full flex-col justify-between rounded-[28px] bg-lime p-7 text-night">
              <p className="text-[14px] font-semibold text-night/70">চিরকাল ফ্রি</p>
              <div>
                <p className="display text-[72px] font-bold leading-none sm:text-[84px]">৳০</p>
                <p className="mt-3 text-[15px] leading-relaxed text-night/75">কোনো লুকানো চার্জ, লিমিট বা সাবস্ক্রিপশন নেই।</p>
              </div>
            </div>
          </Reveal>

          {/* Speed */}
          <Reveal delay={0.1} className="md:col-span-3 lg:col-span-2">
            <div className="flex h-full flex-col justify-between gap-8 rounded-[28px] bg-paper p-7 ring-1 ring-line shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-muted">চোখের পলকে</p>
                <span className="grid size-11 place-items-center rounded-full bg-sun-soft text-sun-deep">
                  <Zap className="size-5" fill="currentColor" aria-hidden="true" />
                </span>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <p className="display text-[56px] font-bold leading-none text-ink">০</p>
                  <p className="pb-1.5 text-[17px] font-semibold text-ink">সেকেন্ড আপলোড</p>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">আপলোড-ডাউনলোডের ঝামেলা নেই, তাই কাজ হয় মুহূর্তেই।</p>
              </div>
            </div>
          </Reveal>

          {/* Devices */}
          <Reveal delay={0.14} className="md:col-span-6 lg:col-span-3">
            <div className="flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[28px] bg-paper p-7 ring-1 ring-line shadow-card sm:flex-row sm:items-end">
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-muted">যেকোনো ডিভাইসে</p>
                <h3 className="display mt-3 text-[28px] font-bold text-ink">মোবাইল থেকে কম্পিউটার — সব জায়গায় সমান সহজ।</h3>
              </div>
              <div className="flex shrink-0 items-end gap-2" aria-hidden="true">
                {[
                  [Smartphone, "h-24 w-14"],
                  [Tablet, "h-28 w-20"],
                  [Monitor, "h-32 w-28"],
                ].map(([I, sz], i) => (
                  <span
                    key={i}
                    className={`grid ${sz} place-items-center rounded-2xl ${i === 0 ? "bg-forest-900 text-lime" : "bg-cream text-forest-700 ring-1 ring-line"}`}
                  >
                    <I className="size-6" />
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Bento />
      <ToolsGrid />

      {/* Free audit */}
      <section id="audit" className="relative isolate scroll-mt-20 overflow-hidden bg-night py-20 text-white sm:py-28">
        <div className="grid-lines pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_20%_30%,#000_10%,transparent_65%)]" />
        <div className="pointer-events-none absolute -left-40 top-0 -z-10 size-[560px] rounded-full bg-forest-600/30 blur-[140px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 size-[420px] rounded-full bg-lime/10 blur-[120px]" />
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
          <Reveal>
            <Eyebrow dark>Roottosuccess এর পক্ষ থেকে</Eyebrow>
            <h2 className="display mt-5 text-[36px] font-bold sm:text-5xl lg:text-[60px]">
              আপনার ফেসবুক পেজের <span className="text-gradient">ফ্রি অডিট</span>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/60 sm:text-lg">
              পেজ আছে কিন্তু সেল আসছে না? আমরা আপনার পেজ বিশ্লেষণ করে জানাব — কী কী করলে আপনার বিজনেস গ্রোথ হবে।
            </p>
            <ul className="mt-9 grid gap-px overflow-hidden rounded-2xl bg-white/[0.08] ring-1 ring-white/[0.08]">
              {AUDIT_POINTS.map((p, i) => (
                <li key={p} className="flex items-center gap-4 bg-night/80 px-5 py-4 text-[16px] text-white/85">
                  <span className="display w-7 shrink-0 text-[15px] font-semibold text-lime">০{["১", "২", "৩", "৪"][i]}</span>
                  {p}
                  <Check className="ml-auto size-5 shrink-0 text-white/30" aria-hidden="true" />
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                ["২ মিনিট", "ফর্ম পূরণে"],
                ["৳০", "কোনো খরচ নেই"],
                ["WhatsApp", "এ রিপোর্ট"],
              ].map(([a, b]) => (
                <div key={b}>
                  <p className="display text-[24px] font-bold text-white sm:text-[30px]">{a}</p>
                  <p className="text-[13px] text-white/50">{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-px rounded-[30px] bg-gradient-to-b from-lime/40 via-white/10 to-transparent" aria-hidden="true" />
              <div className="relative rounded-[29px] bg-paper p-5 text-ink shadow-[0_40px_100px_-30px_rgb(0_0_0/0.8)] sm:p-8">
                <div className="mb-6 flex items-start justify-between gap-3 border-b border-line pb-5">
                  <div>
                    <p className="display text-[24px] font-bold text-ink">অডিটের জন্য তথ্য দিন</p>
                    <p className="mt-1 text-[14px] text-muted">২ মিনিটের কাজ — রিপোর্ট আসবে হোয়াটসঅ্যাপে</p>
                  </div>
                  <span className="hidden shrink-0 rounded-full bg-lime px-3 py-1 text-[13px] font-bold text-night sm:inline">ফ্রি</span>
                </div>
                <AuditForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TrustSection />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading align="left" size="md" eyebrow="প্রশ্নোত্তর" title="সাধারণ জিজ্ঞাসা" desc="যা জানতে চান, তার বেশিরভাগ উত্তর এখানেই।" />
            <div className="mt-8 rounded-[24px] bg-paper p-6 ring-1 ring-line shadow-card">
              <span className="grid size-11 place-items-center rounded-full bg-forest-900 text-lime">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <p className="display mt-4 text-[20px] font-bold text-ink">আরও প্রশ্ন আছে?</p>
              <p className="mt-1 text-[15px] text-muted">সরাসরি আমাদের সাথে কথা বলুন — দ্রুত উত্তর পাবেন।</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={waLink("আসসালামু আলাইকুম, Roottosuccess এর ব্যাপারে একটা প্রশ্ন ছিল।")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-wa px-5 text-[15px] font-semibold text-white transition hover:brightness-95"
                >
                  <WhatsAppGlyph className="size-5" /> হোয়াটসঅ্যাপ
                </a>
                <Link
                  href="/audit/"
                  className="inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[15px] font-semibold text-ink ring-1 ring-inset ring-line-strong transition hover:bg-cream"
                >
                  যোগাযোগ করুন <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
          <Faq />
        </div>
      </section>
    </>
  );
}

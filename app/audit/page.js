import { Search, LineChart, MessageSquareText, Rocket, Phone } from "lucide-react";
import AuditForm from "@/components/AuditForm";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "ফ্রি ফেসবুক পেজ অডিট",
  description: "Roottosuccess আপনার ফেসবুক পেজ অডিট করে জানাবে কী কী করলে আপনার বিজনেস গ্রোথ হবে — সম্পূর্ণ ফ্রি।",
  alternates: { canonical: "/audit/" },
};

const STEPS = [
  { icon: MessageSquareText, title: "তথ্য দিন", desc: "নাম, পেজের নাম ও হোয়াটসঅ্যাপ নাম্বার দিয়ে ফর্মটি পূরণ করুন।" },
  { icon: Search, title: "আমরা পেজ দেখব", desc: "আমাদের টিম আপনার পেজের কনটেন্ট, ব্র্যান্ডিং ও অ্যাড বিশ্লেষণ করবে।" },
  { icon: LineChart, title: "রিপোর্ট পাবেন", desc: "কোথায় সমস্যা আর কী করলে গ্রোথ হবে — হোয়াটসঅ্যাপে জানানো হবে।" },
  { icon: Rocket, title: "গ্রো করুন", desc: "পরামর্শ অনুযায়ী কাজ করুন, চাইলে আমরা পাশে থেকে সাহায্য করব।" },
];

export default function AuditPage() {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-8 sm:pt-14">
      <div className="grid-lines-dark pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_70%_at_20%_0%,#000_30%,transparent_80%)]" />
      <div className="pointer-events-none absolute -left-40 -top-60 -z-10 h-[520px] w-[820px] rounded-full bg-[radial-gradient(closest-side,rgb(180_242_92/0.3),transparent)]" />
      <div className="container-x relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <Reveal>
            <Eyebrow>Roottosuccess · ফ্রি সার্ভিস</Eyebrow>
            <h1 className="display mt-5 text-[40px] font-bold text-ink sm:text-6xl">
              আপনার পেজের{" "}
              <span className="whitespace-nowrap text-forest-600 underline decoration-lime decoration-[8px] underline-offset-[12px]">
                ফ্রি অডিট
              </span>{" "}
              নিন
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted sm:text-lg">
              ফেসবুক পেজ থেকে কাঙ্ক্ষিত সেল আসছে না? কী কী করলে আপনার বিজনেস গ্রোথ হবে — আমরা পেজ দেখে বিস্তারিত জানাব।
            </p>
          </Reveal>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[24px] bg-line ring-1 ring-line">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.08 + i * 0.06} className="flex gap-4 bg-paper p-5">
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-forest-900 text-lime">
                  <s.icon className="size-5" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-lime text-[11px] font-bold text-night ring-2 ring-paper">
                    {["১", "২", "৩", "৪"][i]}
                  </span>
                </span>
                <div>
                  <h2 className="display text-[19px] font-bold text-ink">{s.title}</h2>
                  <p className="text-[15px] text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <a href={`tel:${SITE.phone}`} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full px-5 font-semibold text-ink ring-1 ring-inset ring-line-strong transition hover:bg-paper">
            <Phone className="size-4" /> সরাসরি কল করুন: {SITE.phoneDisplay}
          </a>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-[28px] bg-paper p-5 ring-1 ring-line shadow-lift sm:p-8">
            <p className="display text-[24px] font-bold text-ink">অডিটের জন্য তথ্য দিন</p>
            <p className="mb-6 mt-1 border-b border-line pb-5 text-[14px] text-muted">সাবমিট করলে আপনার তথ্যসহ হোয়াটসঅ্যাপ খুলবে, শুধু Send চাপুন।</p>
            <AuditForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

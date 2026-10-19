import {
  CalendarClock,
  Undo2,
  KeyRound,
  FileText,
  Users,
  FlaskConical,
  ArrowUpRight,
  MapPin,
  Clock,
  Globe,
  Palette,
  CreditCard,
  CalendarDays,
  MessageCircle,
  Megaphone,
  Camera,
  GraduationCap,
  PhoneCall,
  ClipboardList,
  Rocket,
} from "lucide-react";
import Reveal from "../Reveal";
import { SectionHeading, Eyebrow } from "../ui";
import { WhatsAppGlyph, FacebookGlyph } from "../Icon";
import { SITE, waLink } from "@/lib/site";

const PROMISES = [
  { icon: CalendarClock, title: "৩ কর্মদিবসে লাইভ", desc: "পেমেন্টের পর ৩ কর্মদিবসের মধ্যে আপনার সাইট লাইভ হয়ে যায়।" },
  { icon: Undo2, title: "টাকা ফেরতের গ্যারান্টি", desc: "চুক্তির সময়ে সাইট লাইভ না হলে সার্ভিস ফি পুরোটা ফেরত — কোনো শর্ত ছাড়া।" },
  { icon: KeyRound, title: "ডোমেইন আপনার নামে", desc: "চাইলে যেকোনো সময় অন্য কোথাও নিয়ে যেতে পারবেন।" },
  { icon: FileText, title: "প্রতিটি কাজে লিখিত চুক্তি", desc: "কী পাবেন, কবে পাবেন — সব লিখিত থাকে। কোনো লুকানো খরচ নেই।" },
  { icon: Users, title: " সীমিত সংখ্যক ক্লায়েন্ট, সর্বোচ্চ প্রিমিয়াম সেবার নিশ্চয়তা।", desc: "কম ক্লায়েন্ট নিই, যাতে প্রতিটি ব্যবসাকে পুরো মনোযোগ দিতে পারি।" },
  { icon: FlaskConical, title: "নিজের ব্যবসায় পরীক্ষিত", desc: "আমরা নিজেরাও ব্যবসা চালাই — যা আপনাকে দিই, আগে নিজেদের ব্র্যান্ডে করে দেখেছি।" },
];

const SERVICES = [
  { icon: Globe, title: "ওয়েবসাইট ডিজাইন", desc: "নিজের ডোমেইন, SSL সহ দ্রুত ও মোবাইল-ফ্রেন্ডলি ওয়েবসাইট" },
  { icon: Palette, title: "ব্র্যান্ড আইডেন্টিটি", desc: "কনসেপ্ট, ট্যাগলাইন, কভার, বায়ো ও পোস্ট টেমপ্লেট" },
  { icon: CreditCard, title: "বিজনেস প্রোফাইল ও কার্ড", desc: "পেশাদার বিজনেস প্রোফাইল ও প্রিন্ট-রেডি বিজনেস কার্ড" },
  { icon: CalendarDays, title: "কনটেন্ট স্ট্র্যাটেজি", desc: "৩০ দিনের কনটেন্ট ক্যালেন্ডার — কবে কী পোস্ট করবেন" },
  { icon: MessageCircle, title: "মেসেঞ্জার অটোমেশন", desc: "অটো-রিপ্লাই ও FAQ — কাস্টমার কখনো উত্তরের অপেক্ষায় থাকবে না" },
  { icon: Megaphone, title: "অ্যাড ম্যানেজমেন্ট", desc: "সঠিক কাস্টমারের কাছে বিজ্ঞাপন, নিয়মিত মনিটরিং ও রিপোর্ট" },
  { icon: Camera, title: "ফটোগ্রাফি গাইড", desc: "প্রোডাক্ট ও মডেল ছবির স্টাইল গাইড — ব্র্যান্ডের সাথে মিল রেখে" },
  { icon: GraduationCap, title: "মেন্টরশিপ", desc: "Learn → Build → Sell → Scale — নিজেই ব্যবসা চালাতে শিখবেন" },
];

const STEPS = [
  { icon: PhoneCall, title: "ফ্রি কল", desc: "আপনার ব্যবসা ও লক্ষ্য নিয়ে কথা বলি — কোনো খরচ নেই।" },
  { icon: ClipboardList, title: "২৪ ঘণ্টায় লিখিত প্রস্তাব", desc: "আপনার জন্য উপযুক্ত পরিকল্পনা লিখিতভাবে পাঠাই।" },
  { icon: FileText, title: "চুক্তি ও কাজ শুরু", desc: "সব কিছু লিখিত চুক্তিতে ঠিক করে কাজ শুরু করি।" },
  { icon: Rocket, title: "লাইভ ও হ্যান্ডওভার", desc: "সাইট লাইভ করে আপনাকে নিজে চালানো শিখিয়ে দিই।" },
];

const BN = ["০১", "০২", "০৩", "০৪", "০৫", "০৬", "০৭", "০৮"];

export default function TrustSection() {
  return (
    <>
      {/* Why trust — editorial numbered grid */}
      <section id="why" className="scroll-mt-20 border-t border-line bg-cream py-20 sm:py-28">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <Eyebrow>কেন Roottosuccess</Eyebrow>
              <h2 className="display mt-5 text-[34px] font-bold text-ink sm:text-5xl lg:text-[56px]">
                ফেসবুক পেজকে বিশ্বস্ত ব্র্যান্ডে পরিণত করি
              </h2>
            </div>
            <p className="max-w-lg text-[17px] leading-relaxed text-muted lg:justify-self-end">
              আমরা ওয়েবসাইট, ব্র্যান্ড আর কনটেন্ট সিস্টেম বানিয়ে দিই — তারপর আপনাকেই চালানো শিখিয়ে দিই, যাতে সারাজীবন কারো উপর নির্ভর করতে না হয়।
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] bg-ink/10 ring-1 ring-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {PROMISES.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.07} className="group bg-cream p-7 transition-colors duration-300 hover:bg-paper sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="display text-[15px] font-semibold text-forest-600">{BN[i]}</span>
                  <span className="grid size-11 place-items-center rounded-full bg-paper text-forest-700 ring-1 ring-line transition-colors duration-300 group-hover:bg-forest-900 group-hover:text-lime group-hover:ring-forest-900">
                    <p.icon className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="display mt-6 text-[24px] font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 bg-paper py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="আমাদের সার্ভিস"
            title="ব্যবসা বড় করতে যা যা লাগে"
            desc="একটা জায়গা থেকেই পাবেন অনলাইন ব্যবসার সব দরকারি সার্ভিস।"
          />
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 0.06}>
                <div className="group relative h-full overflow-hidden rounded-[24px] bg-cream p-6 ring-1 ring-line transition-colors duration-500 hover:bg-forest-900">
                  <div className="flex items-center">
                    <span className="grid size-12 place-items-center rounded-2xl bg-paper text-forest-700 ring-1 ring-line transition-all duration-500 group-hover:bg-lime group-hover:text-night group-hover:ring-lime">
                      <s.icon className="size-6" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="display mt-8 text-[21px] font-bold text-ink transition-colors duration-500 group-hover:text-white">{s.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/60">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Process */}
          <div className="mt-24 sm:mt-32">
            <SectionHeading eyebrow="কীভাবে কাজ করি" title="সহজ ও পরিষ্কার ৪টি ধাপ" size="md" />
            <ol className="mt-14 grid gap-3 md:grid-cols-4">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 0.1} className="relative">
                  <div className="h-full rounded-[24px] p-6 ring-1 ring-line">
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 place-items-center rounded-full bg-forest-900 text-lime">
                        <s.icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent" aria-hidden="true" />
                      <span className="display text-[40px] font-bold leading-none text-ink/[0.08]">{BN[i]}</span>
                    </div>
                    <h3 className="display mt-6 text-[21px] font-bold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Contact CTA */}
          <Reveal className="mt-24 sm:mt-32">
            <div className="relative isolate overflow-hidden rounded-[32px] bg-night p-7 text-white sm:p-12 lg:p-16">
              <div className="grid-lines pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_80%_20%,#000,transparent_70%)]" />
              <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-lime/20 blur-[100px]" />
              <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                <div>
                  <h2 className="display text-[32px] font-bold sm:text-5xl">
                    আপনার ব্যবসা নিয়ে কথা বলুন — <span className="text-gradient">ফ্রি</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-[17px] text-white/60">
                    কোন সার্ভিস আপনার জন্য ঠিক, সেটা ফ্রি কলে বুঝে নিন। কোনো চাপ নেই, কোনো বাধ্যবাধকতা নেই।
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-[14px] text-white/75">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 ring-1 ring-white/10">
                      <MapPin className="size-4 text-lime" /> {SITE.address}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 ring-1 ring-white/10">
                      <Clock className="size-4 text-lime" /> {SITE.hours}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2.5">
                  <a
                    href={waLink("আসসালামু আলাইকুম, আমি Roottosuccess এর সার্ভিস নিয়ে একটা ফ্রি কল করতে চাই।")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-lime px-6 text-[17px] font-semibold text-night shadow-glow transition hover:bg-lime-deep active:scale-[0.98]"
                  >
                    <WhatsAppGlyph className="size-5" /> হোয়াটসঅ্যাপে কথা বলুন
                  </a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={SITE.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 font-semibold ring-1 ring-inset ring-white/20 transition hover:bg-white/[0.06]"
                    >
                      <FacebookGlyph className="size-5" /> ফেসবুক
                    </a>
                    <a
                      href={SITE.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 font-semibold ring-1 ring-inset ring-white/20 transition hover:bg-white/[0.06]"
                    >
                      ওয়েবসাইট <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

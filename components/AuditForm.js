"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check, ArrowRight, PartyPopper, RotateCcw } from "lucide-react";
import { Button } from "./ui";
import { WhatsAppGlyph } from "./Icon";
import { useToast } from "./Providers";
import { SITE, waLink } from "@/lib/site";
import { copyText, toEnDigits } from "@/lib/format";

const CATEGORIES = [
  "অনলাইন শপ / ই-কমার্স",
  "ফ্যাশন ও পোশাক",
  "খাবার ও রেস্টুরেন্ট",
  "শিক্ষা ও কোচিং",
  "সার্ভিস বিজনেস",
  "এগ্রো / খামার",
  "হেলথ ও বিউটি",
  "অন্যান্য",
];

const PROBLEMS = [
  "রিচ কম",
  "সেল কম",
  "ইনবক্সে মেসেজ কম",
  "অ্যাডে খরচ বেশি",
  "কনটেন্ট আইডিয়া নেই",
  "ফলোয়ার বাড়ছে না",
];

function normalizePhone(raw) {
  const d = toEnDigits(raw).replace(/\D/g, "");
  if (/^01[3-9]\d{8}$/.test(d)) return d;
  if (/^8801[3-9]\d{8}$/.test(d)) return "0" + d.slice(3);
  return null;
}

export default function AuditForm({ dark = false }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", business: "", link: "", phone: "", category: "", note: "" });
  const [problems, setProblems] = useState([]);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const toggleProblem = (p) => setProblems((list) => (list.includes(p) ? list.filter((x) => x !== p) : [...list, p]));

  function validate() {
    const er = {};
    if (!form.name.trim()) er.name = "আপনার নাম লিখুন";
    if (!form.business.trim()) er.business = "বিজনেস বা পেজের নাম লিখুন";
    if (!normalizePhone(form.phone)) er.phone = "সঠিক নাম্বার দিন (যেমন: 01XXXXXXXXX)";
    setErrors(er);
    if (Object.keys(er).length) {
      toast("লাল চিহ্নিত ঘরগুলো ঠিক করে দিন", "error");
      const first = document.getElementById(`audit-${Object.keys(er)[0]}`);
      first?.focus();
      return false;
    }
    return true;
  }

  function buildMessage() {
    const lines = [
      "*ফ্রি পেজ অডিট রিকোয়েস্ট — Roottosuccess*",
      "",
      `👤 নাম: ${form.name.trim()}`,
      `🏢 বিজনেস / পেজ: ${form.business.trim()}`,
    ];
    if (form.link.trim()) lines.push(`🔗 পেজ লিংক: ${form.link.trim()}`);
    lines.push(`📱 ফোন / হোয়াটসঅ্যাপ: ${normalizePhone(form.phone) || form.phone.trim()}`);
    if (form.category) lines.push(`📂 ক্যাটাগরি: ${form.category}`);
    if (problems.length) lines.push(`⚠️ মূল সমস্যা: ${problems.join(", ")}`);
    if (form.note.trim()) lines.push(`📝 বিস্তারিত: ${form.note.trim()}`);
    lines.push("", "আমার পেজটি অডিট করে কী কী করলে বিজনেস গ্রোথ হবে জানালে উপকৃত হব। ধন্যবাদ।");
    return lines.join("\n");
  }

  function send(e) {
    e?.preventDefault();
    if (!validate()) return;
    window.open(waLink(buildMessage()), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  async function copyReport() {
    if (!validate()) return;
    const ok = await copyText(buildMessage());
    if (ok) {
      setCopied(true);
      toast("রিপোর্ট কপি হয়েছে — হোয়াটসঅ্যাপে পেস্ট করুন");
      setTimeout(() => setCopied(false), 2000);
    } else toast("কপি করা যায়নি", "error");
  }

  const fieldCls = (k) => `field ${dark ? "!bg-white" : ""}`;

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
              className="grid size-20 place-items-center rounded-full bg-sun-soft text-sun-deep"
            >
              <PartyPopper className="size-9" />
            </motion.div>
            <h3 className="mt-5 font-display text-2xl font-bold text-forest-900">প্রায় শেষ!</h3>
            <p className="mt-2 max-w-sm text-[15px] text-muted">
              হোয়াটসঅ্যাপে আপনার তথ্যসহ মেসেজ রেডি। শুধু <b className="text-forest-800">Send</b> বাটনে চাপ দিন — আমরা
              দ্রুত আপনার পেজ অডিট করে জানাব।
            </p>
            <div className="mt-6 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <Button variant="wa" onClick={send}>
                <WhatsAppGlyph /> আবার হোয়াটসঅ্যাপ খুলুন
              </Button>
              <Button variant="outline" onClick={() => setSent(false)}>
                <RotateCcw className="size-4" /> তথ্য এডিট করুন
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={send}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="audit-name" className="label">
                  আপনার নাম <span className="text-danger">*</span>
                </label>
                <input
                  id="audit-name"
                  className={fieldCls("name")}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="যেমন: রহিম উদ্দিন"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "audit-name-err" : undefined}
                />
                <FieldError id="audit-name-err" msg={errors.name} />
              </div>
              <div>
                <label htmlFor="audit-business" className="label">
                  বিজনেস / পেজের নাম <span className="text-danger">*</span>
                </label>
                <input
                  id="audit-business"
                  className={fieldCls("business")}
                  value={form.business}
                  onChange={set("business")}
                  placeholder="যেমন: রহিম ফ্যাশন হাউস"
                  autoComplete="organization"
                  aria-invalid={!!errors.business}
                  aria-describedby={errors.business ? "audit-business-err" : undefined}
                />
                <FieldError id="audit-business-err" msg={errors.business} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="audit-phone" className="label">
                  ফোন / হোয়াটসঅ্যাপ নাম্বার <span className="text-danger">*</span>
                </label>
                <input
                  id="audit-phone"
                  className={fieldCls("phone")}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "audit-phone-err" : undefined}
                />
                <FieldError id="audit-phone-err" msg={errors.phone} />
              </div>
              <div>
                <label htmlFor="audit-link" className="label">
                  পেজের লিংক <span className="font-normal text-muted">(ঐচ্ছিক)</span>
                </label>
                <input
                  id="audit-link"
                  className={fieldCls("link")}
                  value={form.link}
                  onChange={set("link")}
                  placeholder="facebook.com/আপনার-পেজ"
                  inputMode="url"
                />
              </div>
            </div>

            <div>
              <label htmlFor="audit-category" className="label">
                বিজনেসের ধরন <span className="font-normal text-muted">(ঐচ্ছিক)</span>
              </label>
              <select id="audit-category" className={`${fieldCls("category")}`} value={form.category} onChange={set("category")}>
                <option value="">নির্বাচন করুন</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="label">মূল সমস্যা কী? <span className="font-normal text-muted">(একাধিক বাছাই করা যাবে)</span></legend>
              <div className="flex flex-wrap gap-2">
                {PROBLEMS.map((p) => {
                  const on = problems.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleProblem(p)}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold ring-1 ring-inset transition-all active:scale-95 ${
                        on
                          ? "bg-forest-700 text-white ring-forest-700"
                          : "bg-paper text-forest-800 ring-line-strong hover:ring-forest-600"
                      }`}
                    >
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }}>
                            <Check className="size-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {p}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="audit-note" className="label">
                আরও কিছু বলতে চান? <span className="font-normal text-muted">(ঐচ্ছিক)</span>
              </label>
              <textarea
                id="audit-note"
                rows={3}
                className={`${fieldCls("note")} resize-y`}
                value={form.note}
                onChange={set("note")}
                placeholder="আপনার বিজনেস নিয়ে সংক্ষেপে লিখুন…"
              />
            </div>

            <div className="mt-1 grid gap-2.5 sm:grid-cols-[1fr_auto]">
              <Button type="submit" variant="wa" size="lg" className="w-full">
                <WhatsAppGlyph /> হোয়াটসঅ্যাপে রিপোর্ট পাঠান
              </Button>
              <Button variant="outline" size="lg" onClick={copyReport} className="w-full">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                রিপোর্ট কপি করুন
              </Button>
            </div>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center justify-center gap-1.5 text-[15px] font-semibold ${
                dark ? "text-forest-700" : "text-forest-700"
              } hover:underline`}
            >
              সরাসরি হোয়াটসঅ্যাপ খুলুন ({SITE.phoneDisplay})
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldError({ id, msg }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1.5 text-[13px] font-medium text-danger"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cake, CalendarHeart } from "lucide-react";
import { Card } from "../ui";
import { fmtNum, toBn } from "@/lib/format";

const WEEKDAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
const MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const parse = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
};
const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();

function diff(a, b) {
  let y = b.getFullYear() - a.getFullYear();
  let m = b.getMonth() - a.getMonth();
  let d = b.getDate() - a.getDate();
  if (d < 0) {
    m--;
    d += daysIn(b.getFullYear(), b.getMonth() - 1); // days in the previous month (Date handles Jan → Dec)
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return { y, m, d };
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  const [at, setAt] = useState(today());

  const r = useMemo(() => {
    const a = parse(dob), b = parse(at);
    if (!a || !b || a > b) return null;
    const { y, m, d } = diff(a, b);
    const totalDays = Math.round((b - a) / 86400000);
    let next = new Date(b.getFullYear(), a.getMonth(), a.getDate());
    if (next < b) next = new Date(b.getFullYear() + 1, a.getMonth(), a.getDate());
    const left = Math.round((next - b) / 86400000);
    return { y, m, d, totalDays, weeks: Math.floor(totalDays / 7), months: y * 12 + m, left, weekday: WEEKDAYS[a.getDay()], born: `${toBn(a.getDate())} ${MONTHS[a.getMonth()]} ${toBn(a.getFullYear())}`, nextAge: y + 1 };
  }, [dob, at]);

  return (
    <div className="mx-auto grid max-w-4xl gap-5">
      <Card className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <label htmlFor="dob" className="label">জন্ম তারিখ</label>
          <input id="dob" type="date" className="field" value={dob} max={at} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div>
          <label htmlFor="at" className="label">যে তারিখ পর্যন্ত হিসাব</label>
          <input id="at" type="date" className="field" value={at} onChange={(e) => setAt(e.target.value)} />
        </div>
      </Card>

      {r ? (
        <>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-line">
              {[
                [r.y, "বছর"],
                [r.m, "মাস"],
                [r.d, "দিন"],
              ].map(([n, l], i) => (
                <div key={l} className="px-2 py-7 text-center">
                  <motion.p
                    key={`${l}-${n}`}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                    className="font-display text-5xl font-bold text-forest-700 sm:text-6xl"
                  >
                    {toBn(n)}
                  </motion.p>
                  <p className="mt-1 font-semibold text-muted">{l}</p>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["মোট মাস", fmtNum(r.months)],
              ["মোট সপ্তাহ", fmtNum(r.weeks)],
              ["মোট দিন", fmtNum(r.totalDays)],
            ].map(([l, v]) => (
              <Card key={l} className="p-4">
                <p className="text-[13px] font-semibold text-muted">{l}</p>
                <p className="mt-1 text-2xl font-bold text-forest-900">{v}</p>
              </Card>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-2xl bg-sun-soft text-sun-deep">
                <Cake className="size-6" />
              </span>
              <div>
                <p className="font-bold text-forest-900">
                  {r.left === 0 ? "আজ আপনার জন্মদিন! 🎉" : `পরের জন্মদিন ${toBn(r.left)} দিন পর`}
                </p>
                <p className="text-[14px] text-muted">তখন বয়স হবে {toBn(r.left === 0 ? r.y : r.nextAge)} বছর</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-5">
              <span className="grid size-12 place-items-center rounded-2xl bg-leaf-soft text-forest-700">
                <CalendarHeart className="size-6" />
              </span>
              <div>
                <p className="font-bold text-forest-900">{r.weekday}</p>
                <p className="text-[14px] text-muted">জন্ম: {r.born}</p>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-6 text-center text-muted">জন্ম তারিখটি হিসাবের তারিখের আগে হতে হবে।</Card>
      )}
    </div>
  );
}

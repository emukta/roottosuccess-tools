// সব কোম্পানি তথ্য এক জায়গায় — এখানে বদলালে পুরো সাইটে বদলাবে।
export const SITE = {
  name: "Roottosuccess",
  tagline: "Learn. Grow. Succeed.",
  phone: "01611120206",
  phoneDisplay: "০১৬১১-১২০২০৬",
  // হোয়াটসঅ্যাপ নাম্বার আন্তর্জাতিক ফরম্যাটে (৮৮০ + ০ বাদে)
  whatsapp: "8801611120206",
  website: "https://roottosuccess.com/",
  facebook: "https://www.facebook.com/roottosucess",
  address: "যাত্রাবাড়ী, ঢাকা",
  hours: "শনি–বৃহস্পতি, সকাল ১০টা – সন্ধ্যা ৭টা",
  // এই টুলস সাইট যে ডোমেইনে হোস্ট করবেন (SEO ও sitemap এর জন্য)
  url: "https://tools.roottosuccess.com",
};

export function waLink(text = "") {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

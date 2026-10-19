# Roottosuccess Free Tools

বাংলায় ফ্রি অনলাইন টুলস — Next.js 15 + React 19 + Tailwind CSS 4 + Framer Motion (শুধু JavaScript, কোনো TypeScript নেই)।
পুরো সাইট **static** — Cloudflare Pages এর ফ্রি হোস্টিংয়ে চলবে। সব টুল ব্যবহারকারীর ব্রাউজারেই কাজ করে, কোনো সার্ভার/ডাটাবেস লাগে না।

## টুলসমূহ
| টুল | লিংক |
|---|---|
| ইমেজ ফরম্যাট কনভার্টার (JPG/PNG/WEBP/AVIF/BMP/TIFF, HEIC ইনপুট, ফোল্ডার বাল্ক, ZIP) | `/tools/image-converter/` |
| ইমেজ মেটাডাটা ক্লিনার (EXIF/GPS/XMP/C2PA মুছুন + নিজের মেটাডাটা যোগ) | `/tools/metadata-cleaner/` |
| ইমেজ আপস্কেলার (২x/৩x/৪x + শার্পেন, আগে-পরে তুলনা) | `/tools/image-upscaler/` |
| ইমেজ কমপ্রেস ও রিসাইজ | `/tools/image-compressor/` |
| বিজয় ⇄ ইউনিকোড কনভার্টার | `/tools/bijoy-unicode/` |
| শব্দ ও অক্ষর গণনা | `/tools/word-counter/` |
| সংখ্যা থেকে কথায় (টাকা, বাংলা + ইংরেজি) | `/tools/number-to-words/` |
| QR কোড জেনারেটর (লিংক, লেখা, ফোন, ওয়াইফাই, ইমেইল) | `/tools/qr-generator/` |
| হোয়াটসঅ্যাপ লিংক জেনারেটর | `/tools/whatsapp-link/` |
| বয়স ক্যালকুলেটর | `/tools/age-calculator/` |
| **ফ্রি পেজ অডিট ফর্ম** → সরাসরি 01611120206 হোয়াটসঅ্যাপে যায় | `/audit/` এবং হোমপেজ |

## লোকাল কম্পিউটারে চালানো
Node.js 20 বা তার বেশি লাগবে।

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static সাইট তৈরি হবে `out/` ফোল্ডারে
```

## Cloudflare Pages এ ডিপ্লয় (ফ্রি)

**পদ্ধতি ১ — GitHub দিয়ে (সাজেস্টেড, প্রতিবার push করলে অটো আপডেট):**
1. প্রজেক্টটি একটি GitHub রিপোজিটরিতে push করুন।
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → রিপো সিলেক্ট করুন।
3. Build settings:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variable: `NODE_VERSION` = `20`
4. **Save and Deploy**।

**পদ্ধতি ২ — সরাসরি আপলোড:**
`npm run build` চালিয়ে তৈরি হওয়া `out` ফোল্ডারটি Cloudflare Pages → **Upload assets** এ ড্র্যাগ করে দিন।

**কাস্টম ডোমেইন:** Pages প্রজেক্ট → Custom domains → যেমন `tools.roottosuccess.com` যোগ করুন।
তারপর `lib/site.js` ফাইলে `url` টি আপনার ডোমেইন দিয়ে বদলে দিন (SEO ও sitemap এর জন্য)।

## কোথায় কী বদলাবেন
- **ফোন / হোয়াটসঅ্যাপ / ওয়েবসাইট / রিসোর্স লিংক:** `lib/site.js`
- **টুলের নাম, বর্ণনা, ক্যাটাগরি:** `lib/tools.js`
- **রং ও ফন্ট:** `app/globals.css` এর `@theme` অংশ
- **লোগো:** `public/icon.png`, `public/logo-full.png`

## নতুন টুল যোগ করা
1. `components/tools/MyTool.js` তৈরি করুন (`"use client"` দিয়ে শুরু)।
2. `lib/tools.js` এর `TOOLS` লিস্টে একটি এন্ট্রি দিন (slug, name, desc, icon, category)।
3. `components/ToolRenderer.js` এ slug অনুযায়ী কম্পোনেন্টটি যুক্ত করুন।
পেজ, মেনু, ফুটার, sitemap — সব স্বয়ংক্রিয়ভাবে আপডেট হবে।

## প্রজেক্ট স্ট্রাকচার
```
app/                 পেজসমূহ (হোম, /audit, /tools/[slug], sitemap, robots)
components/          হেডার, ফুটার, অডিট ফর্ম, UI কম্পোনেন্ট
components/tools/    প্রতিটি টুলের কম্পোনেন্ট (আলাদা chunk এ লোড হয়)
lib/                 মূল লজিক — bijoy.js, metadata.js, image.js, banglaNumber.js
public/              লোগো, _headers (Cloudflare সিকিউরিটি ও ক্যাশ হেডার)
```

## ডিজাইন সিস্টেম (v2 — প্রিমিয়াম UI)
- ফন্ট: **Anek Bangla** (হেডলাইন, `.display` ক্লাস) + **Hind Siliguri** (বডি)
- রং (`app/globals.css` → `@theme`): `night` (ডার্ক ব্যাকগ্রাউন্ড), `forest-*` (ব্র্যান্ড সবুজ), `lime` (মূল অ্যাকসেন্ট — শুধু ডার্ক ব্যাকগ্রাউন্ডে), `sun` (হলুদ)
- কম্পোনেন্ট: `components/ui.js` এ `Button` (`primary`, `lime`, `outline`…), `Eyebrow`, `SectionHeading`, `Segmented`
- ইউটিলিটি: `.grid-lines`, `.grid-lines-dark`, `.text-gradient`, `.mask-fade-x`, `animate-marquee`, `animate-float`

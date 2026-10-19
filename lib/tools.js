// টুল রেজিস্ট্রি — নতুন টুল যোগ করতে এখানে একটি এন্ট্রি দিন এবং
// components/ToolRenderer.js এ কম্পোনেন্টটি যুক্ত করুন।

export const CATEGORIES = [
  { id: "all", label: "সব টুল" },
  { id: "image", label: "ছবি" },
  { id: "bangla", label: "বাংলা লেখা" },
  { id: "business", label: "ব্যবসা" },
  { id: "daily", label: "দৈনন্দিন" },
];

export const TOOLS = [
  {
    slug: "image-converter",
    name: "ইমেজ ফরম্যাট কনভার্টার",
    en: "Image Format Converter",
    desc: "JPG, PNG, WEBP, AVIF, BMP, TIFF — যেকোনো ফরম্যাটে ছবি কনভার্ট করুন। একটি ছবি বা পুরো ফোল্ডার একসাথে।",
    icon: "converter",
    category: "image",
    badge: "জনপ্রিয়",
    keywords: "jpg png webp heic convert format folder bulk",
  },
  {
    slug: "metadata-cleaner",
    name: "ইমেজ মেটাডাটা ক্লিনার",
    en: "Image Metadata Cleaner",
    desc: "ছবির EXIF, GPS লোকেশন, ক্যামেরা ও AI মেটাডাটা মুছে ফেলুন। চাইলে নিজের টাইটেল, কিওয়ার্ড, কপিরাইট যোগ করুন।",
    icon: "shield",
    category: "image",
    badge: "প্রাইভেসি",
    keywords: "exif metadata gps ai c2pa remove privacy stock",
  },
  {
    slug: "image-upscaler",
    name: "ইমেজ আপস্কেলার",
    en: "Image Upscaler",
    desc: "ছোট বা ঝাপসা ছবিকে ২x থেকে ৪x বড় করুন, শার্পনেস বাড়িয়ে পরিষ্কার করুন — একদম ফ্রি।",
    icon: "upscale",
    category: "image",
    badge: "নতুন",
    keywords: "upscale enlarge enhance sharpen hd resolution",
  },
  {
    slug: "image-compressor",
    name: "ইমেজ কমপ্রেস ও রিসাইজ",
    en: "Image Compressor",
    desc: "ছবির সাইজ কমান, মাপ ঠিক করুন — ওয়েবসাইট, ফেসবুক ও অনলাইন ফর্মে আপলোডের জন্য পারফেক্ট।",
    icon: "compress",
    category: "image",
    keywords: "compress resize reduce size kb mb optimize",
  },
  {
    slug: "bijoy-unicode",
    name: "বিজয় ⇄ ইউনিকোড কনভার্টার",
    en: "Bijoy to Unicode Converter",
    desc: "বিজয় (SutonnyMJ) লেখাকে ইউনিকোডে এবং ইউনিকোড লেখাকে বিজয়ে কনভার্ট করুন এক ক্লিকে।",
    icon: "languages",
    category: "bangla",
    badge: "জনপ্রিয়",
    keywords: "bijoy unicode sutonnymj avro bangla font convert",
  },
  {
    slug: "word-counter",
    name: "শব্দ ও অক্ষর গণনা",
    en: "Word Counter",
    desc: "বাংলা ও ইংরেজি লেখায় কতগুলো শব্দ, অক্ষর, বাক্য ও অনুচ্ছেদ আছে তা সাথে সাথে জানুন।",
    icon: "type",
    category: "bangla",
    keywords: "word count character bangla english sentence",
  },
  {
    slug: "number-to-words",
    name: "সংখ্যা থেকে কথায় (টাকা)",
    en: "Number to Words",
    desc: "যেকোনো সংখ্যা বা টাকার অঙ্ক বাংলা ও ইংরেজি কথায় লিখুন — চেক ও ইনভয়েসের জন্য দারুণ।",
    icon: "hash",
    category: "bangla",
    keywords: "number words taka cheque invoice bangla digit lakh crore",
  },
  {
    slug: "qr-generator",
    name: "QR কোড জেনারেটর",
    en: "QR Code Generator",
    desc: "ওয়েবসাইট, পেজ, ফোন, ওয়াইফাই বা যেকোনো লেখার QR কোড তৈরি করুন — PNG ও SVG ডাউনলোড।",
    icon: "qr",
    category: "business",
    keywords: "qr code generator wifi link url png svg",
  },
  {
    slug: "whatsapp-link",
    name: "হোয়াটসঅ্যাপ লিংক জেনারেটর",
    en: "WhatsApp Link Generator",
    desc: "কাস্টমার যেন এক ক্লিকে আপনাকে মেসেজ দিতে পারে — রেডি মেসেজসহ হোয়াটসঅ্যাপ লিংক ও QR বানান।",
    icon: "whatsapp",
    category: "business",
    keywords: "whatsapp wa.me link chat button business",
  },
  {
    slug: "age-calculator",
    name: "বয়স ক্যালকুলেটর",
    en: "Age Calculator",
    desc: "জন্মতারিখ দিন — বছর, মাস, দিন হিসেবে সঠিক বয়স ও পরের জন্মদিন কতদিন বাকি জেনে নিন।",
    icon: "calendar",
    category: "daily",
    keywords: "age calculator birthday date difference",
  },
];

export function getTool(slug) {
  return TOOLS.find((t) => t.slug === slug);
}

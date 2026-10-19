// সংখ্যা -> বাংলা কথা / ইংরেজি কথা (বাংলাদেশি কোটি-লাখ পদ্ধতি)

const BN_0_99 = [
  "শূন্য", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়",
  "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ",
  "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আঠাশ", "ঊনত্রিশ",
  "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ",
  "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ",
  "পঞ্চাশ", "একান্ন", "বায়ান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট",
  "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর",
  "সত্তর", "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি",
  "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই",
  "নব্বই", "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই",
];

const EN_ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const EN_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

// n: BigInt >= 0
function bnInt(n) {
  if (n === 0n) return BN_0_99[0];
  const parts = [];
  const crore = n / 10000000n;
  let rest = n % 10000000n;
  if (crore > 0n) parts.push(bnInt(crore) + " কোটি");
  const lakh = rest / 100000n; rest %= 100000n;
  const thousand = rest / 1000n; rest %= 1000n;
  const hundred = rest / 100n; rest %= 100n;
  if (lakh > 0n) parts.push(BN_0_99[Number(lakh)] + " লক্ষ");
  if (thousand > 0n) parts.push(BN_0_99[Number(thousand)] + " হাজার");
  if (hundred > 0n) parts.push(BN_0_99[Number(hundred)] + " শত");
  if (rest > 0n) parts.push(BN_0_99[Number(rest)]);
  return parts.join(" ");
}

function en99(n) {
  if (n < 20) return EN_ONES[n];
  return EN_TENS[Math.floor(n / 10)] + (n % 10 ? "-" + EN_ONES[n % 10] : "");
}

function enInt(n) {
  if (n === 0n) return "Zero";
  const parts = [];
  const crore = n / 10000000n;
  let rest = n % 10000000n;
  if (crore > 0n) parts.push(enInt(crore) + " Crore");
  const lakh = rest / 100000n; rest %= 100000n;
  const thousand = rest / 1000n; rest %= 1000n;
  const hundred = rest / 100n; rest %= 100n;
  if (lakh > 0n) parts.push(en99(Number(lakh)) + " Lakh");
  if (thousand > 0n) parts.push(en99(Number(thousand)) + " Thousand");
  if (hundred > 0n) parts.push(EN_ONES[Number(hundred)] + " Hundred");
  if (rest > 0n) parts.push((parts.length ? "and " : "") + en99(Number(rest)));
  return parts.join(" ");
}

// input: "1234567.89" (English digits) -> parsed parts or null
export function parseAmount(raw) {
  const s = String(raw).replace(/[,\s]/g, "");
  if (!/^\d{1,21}(\.\d{0,2})?$/.test(s)) return null;
  const [i, f = ""] = s.split(".");
  return { int: BigInt(i), frac: f ? Number(f.padEnd(2, "0")) : 0 };
}

export function toBanglaWords(raw, { currency = false } = {}) {
  const p = parseAmount(raw);
  if (!p) return "";
  let out = bnInt(p.int);
  if (currency) {
    out += " টাকা";
    if (p.frac) out += " " + BN_0_99[p.frac] + " পয়সা";
    return out + " মাত্র";
  }
  if (p.frac) out += " দশমিক " + String(p.frac).padStart(2, "0").split("").map((d) => BN_0_99[+d]).join(" ");
  return out;
}

export function toEnglishWords(raw, { currency = false } = {}) {
  const p = parseAmount(raw);
  if (!p) return "";
  let out = enInt(p.int);
  if (currency) {
    out += " Taka";
    if (p.frac) out += " and " + en99(p.frac) + " Paisa";
    return out + " Only";
  }
  if (p.frac) out += " Point " + String(p.frac).padStart(2, "0").split("").map((d) => (d === "0" ? "Zero" : EN_ONES[+d])).join(" ");
  return out;
}

// 1234567 -> 12,34,567 (Indian/BD grouping)
export function groupBD(raw) {
  const p = parseAmount(raw);
  if (!p) return "";
  const s = p.int.toString();
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const g = rest ? rest + "," + last3 : last3;
  const frac = String(raw).includes(".") ? "." + String(raw).split(".")[1] : "";
  return g + frac;
}

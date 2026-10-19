import Link from "next/link";

export default function Logo({ dark = false, className = "" }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Roottosuccess হোম">
      <span
        className={`relative grid size-10 place-items-center overflow-hidden rounded-xl bg-white shadow-sm transition-transform duration-500 ease-out-quint group-hover:-rotate-6 group-hover:scale-105 ${
          dark ? "ring-1 ring-white/20" : "ring-1 ring-line"
        }`}
      >
        <img src="/icon.png" alt="" width={40} height={40} className="size-full object-cover" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[19px] font-bold tracking-tight [font-stretch:94%]">
          <span className={dark ? "text-lime" : "text-forest-600"}>Root</span>
          <span className={dark ? "text-white" : "text-ink"}>toSuccess</span>
        </span>
        <span className={`mt-1 block text-[10px] font-semibold tracking-[0.22em] ${dark ? "text-white/50" : "text-muted"}`}>
          FREE TOOLS
        </span>
      </span>
    </Link>
  );
}

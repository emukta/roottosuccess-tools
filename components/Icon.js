import {
  Repeat2,
  ShieldCheck,
  ZoomIn,
  Minimize2,
  Languages,
  Type,
  Hash,
  QrCode,
  MessageCircle,
  CalendarDays,
  Sparkles,
} from "lucide-react";

const MAP = {
  converter: Repeat2,
  shield: ShieldCheck,
  upscale: ZoomIn,
  compress: Minimize2,
  languages: Languages,
  type: Type,
  hash: Hash,
  qr: QrCode,
  whatsapp: MessageCircle,
  calendar: CalendarDays,
};

// Accent per category keeps the grid scannable
export const CATEGORY_STYLE = {
  image: { bg: "bg-leaf-soft", fg: "text-forest-700", ring: "ring-leaf/30" },
  bangla: { bg: "bg-sun-soft", fg: "text-soil", ring: "ring-sun/40" },
  business: { bg: "bg-forest-900", fg: "text-lime", ring: "ring-forest-900/20" },
  daily: { bg: "bg-soil-soft", fg: "text-soil", ring: "ring-soil/20" },
};

export function ToolIcon({ name, className = "size-6", strokeWidth = 1.9 }) {
  const C = MAP[name] || Sparkles;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export function WhatsAppGlyph({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.41 9.41 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.72 5.8.71 12.05c0 2 .52 3.95 1.52 5.66L.62 23.28l5.7-1.5a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.33-5.08 11.34-11.33 0-3.03-1.18-5.88-3.32-8.02z" />
    </svg>
  );
}

export function FacebookGlyph({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

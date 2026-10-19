"use client";

import dynamic from "next/dynamic";

function Loading() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="লোড হচ্ছে">
      <div className="h-56 animate-pulse rounded-3xl bg-line/60" />
      <div className="h-24 animate-pulse rounded-3xl bg-line/40" />
    </div>
  );
}

// Next.js requires the options to be written inline as an object literal in every call
const COMPONENTS = {
  "image-converter": dynamic(() => import("./tools/ImageConverter"), { ssr: false, loading: Loading }),
  "metadata-cleaner": dynamic(() => import("./tools/MetadataCleaner"), { ssr: false, loading: Loading }),
  "image-upscaler": dynamic(() => import("./tools/ImageUpscaler"), { ssr: false, loading: Loading }),
  "image-compressor": dynamic(() => import("./tools/ImageCompressor"), { ssr: false, loading: Loading }),
  "bijoy-unicode": dynamic(() => import("./tools/BijoyUnicode"), { ssr: false, loading: Loading }),
  "word-counter": dynamic(() => import("./tools/WordCounter"), { ssr: false, loading: Loading }),
  "number-to-words": dynamic(() => import("./tools/NumberToWords"), { ssr: false, loading: Loading }),
  "qr-generator": dynamic(() => import("./tools/QrGenerator"), { ssr: false, loading: Loading }),
  "whatsapp-link": dynamic(() => import("./tools/WhatsAppLink"), { ssr: false, loading: Loading }),
  "age-calculator": dynamic(() => import("./tools/AgeCalculator"), { ssr: false, loading: Loading }),
};

export default function ToolRenderer({ slug }) {
  const C = COMPONENTS[slug];
  return C ? <C /> : null;
}

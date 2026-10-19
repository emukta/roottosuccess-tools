"use client";

import { motion } from "framer-motion";
import { WhatsAppGlyph } from "./Icon";
import { waLink } from "@/lib/site";

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={waLink("আসসালামু আলাইকুম, আমি Roottosuccess এর ব্যাপারে জানতে চাই।")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="হোয়াটসঅ্যাপে মেসেজ করুন"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-4 right-4 z-40 grid size-14 place-items-center rounded-full bg-wa text-white shadow-[0_12px_28px_-8px_rgb(31_189_90/0.7)] sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-wa/30 [animation-duration:3s]" aria-hidden="true" />
      <WhatsAppGlyph className="relative size-7" />
    </motion.a>
  );
}

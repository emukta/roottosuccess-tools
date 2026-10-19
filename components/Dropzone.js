"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FolderOpen, ImagePlus } from "lucide-react";

export default function Dropzone({
  onFiles,
  accept = "image/*",
  multiple = true,
  allowFolder = false,
  title = "ছবি এখানে ড্র্যাগ করুন",
  hint = "অথবা ক্লিক করে ফাইল সিলেক্ট করুন",
  formats,
  compact = false,
}) {
  const [over, setOver] = useState(false);
  const fileRef = useRef(null);
  const folderRef = useRef(null);
  const depth = useRef(0);

  const take = (list) => {
    const files = Array.from(list || []);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div className="grid gap-3">
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`${title} — ${hint}`}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), fileRef.current?.click())}
        onDragEnter={(e) => {
          e.preventDefault();
          depth.current++;
          setOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          depth.current = Math.max(0, depth.current - 1);
          if (!depth.current) setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          take(e.dataTransfer.files);
        }}
        animate={{ scale: over ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`group relative grid cursor-pointer place-items-center overflow-hidden rounded-[24px] border-2 border-dashed text-center transition-colors ${
          compact ? "px-5 py-8" : "px-5 py-12 sm:py-16"
        } ${
          over
            ? "border-forest-600 bg-leaf-soft"
            : "border-line-strong bg-paper hover:border-forest-600 hover:bg-leaf-soft/40"
        }`}
      >
        <motion.span
          animate={over ? { y: -6, scale: 1.08 } : { y: 0, scale: 1 }}
          className="grid size-16 place-items-center rounded-[20px] bg-forest-900 text-lime shadow-lift transition-transform group-hover:-translate-y-1"
        >
          {over ? <ImagePlus className="size-7" /> : <UploadCloud className="size-7" />}
        </motion.span>
        <span className="display mt-5 block text-[22px] font-bold text-ink">{over ? "এখানে ছেড়ে দিন" : title}</span>
        <span className="mt-1 block text-[15px] text-muted">{hint}</span>
        {formats && (
          <span className="mt-4 flex flex-wrap justify-center gap-1.5">
            {formats.map((f) => (
              <span key={f} className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-ink/70 ring-1 ring-line">
                {f}
              </span>
            ))}
          </span>
        )}
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            take(e.target.files);
            e.target.value = "";
          }}
        />
      </motion.div>

      {allowFolder && (
        <>
          <button
            type="button"
            onClick={() => folderRef.current?.click()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-paper px-4 text-[15px] font-semibold text-forest-800 ring-1 ring-line-strong transition hover:bg-leaf-soft/50 hover:ring-forest-600"
          >
            <FolderOpen className="size-5 text-sun-deep" /> পুরো ফোল্ডার সিলেক্ট করুন (বাল্ক)
          </button>
          <input
            ref={folderRef}
            type="file"
            multiple
            className="hidden"
            {...{ webkitdirectory: "", directory: "" }}
            onChange={(e) => {
              take(e.target.files);
              e.target.value = "";
            }}
          />
        </>
      )}
    </div>
  );
}

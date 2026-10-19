"use client";

import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

// Drag/keyboard accessible before–after comparison
export default function BeforeAfter({ before, after, beforeLabel = "আগে", afterLabel = "পরে", pixelated = true }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const move = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="checker relative select-none overflow-hidden rounded-2xl ring-1 ring-line touch-none"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={after} alt={afterLabel} className="block max-h-[70vh] w-full object-contain" draggable={false} />
      <img
        src={before}
        alt={beforeLabel}
        className="absolute inset-0 size-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, imageRendering: pixelated ? "pixelated" : "auto" }}
        draggable={false}
      />
      <span className="absolute left-3 top-3 rounded-lg bg-forest-950/75 px-2 py-1 text-xs font-bold text-white">{beforeLabel}</span>
      <span className="absolute right-3 top-3 rounded-lg bg-sun px-2 py-1 text-xs font-bold text-forest-950">{afterLabel}</span>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -translate-x-1/2 border-l-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.15)]" />
        <div className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-forest-800 shadow-lift">
          <MoveHorizontal className="size-5" />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="তুলনা স্লাইডার"
        className="sr-only"
      />
    </div>
  );
}

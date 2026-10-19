"use client";

import { forwardRef, useId } from "react";
import { motion } from "framer-motion";
import { Loader2, ChevronDown } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-forest-900 text-white hover:bg-forest-800 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_8px_20px_-10px_rgb(6_20_12/0.7)] disabled:bg-forest-900/40",
  lime: "bg-lime text-night hover:bg-lime-deep shadow-[0_10px_30px_-12px_rgb(180_242_92/0.8)] disabled:opacity-50",
  sun: "bg-sun text-night hover:bg-sun-deep shadow-[0_8px_20px_-10px_rgb(240_165_0/0.8)] disabled:bg-sun/50",
  wa: "bg-wa text-white hover:brightness-95 shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_8px_20px_-10px_rgb(31_189_90/0.8)] disabled:opacity-50",
  outline:
    "bg-paper text-ink ring-1 ring-inset ring-line-strong hover:ring-ink/40 hover:bg-cream disabled:opacity-50",
  ghost: "text-forest-800 hover:bg-ink/[0.05] disabled:opacity-50",
  danger: "bg-paper text-danger ring-1 ring-inset ring-danger/30 hover:bg-danger/5 disabled:opacity-50",
  light: "bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15 disabled:opacity-50",
};

const SIZES = {
  sm: "h-9 px-4 text-sm gap-1.5 rounded-full",
  md: "h-11 px-5 text-[15px] gap-2 rounded-full",
  lg: "h-13 px-7 text-base gap-2.5 rounded-full min-h-[52px]",
};

export const Button = forwardRef(function Button(
  { as: Comp = "button", variant = "primary", size = "md", loading = false, className = "", children, disabled, ...props },
  ref
) {
  const isButton = Comp === "button";
  return (
    <Comp
      ref={ref}
      className={`inline-flex select-none items-center justify-center font-semibold transition-[background-color,box-shadow,transform,filter] duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={isButton ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...(isButton && !props.type ? { type: "button" } : {})}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </Comp>
  );
});

export function Card({ className = "", children, ...props }) {
  return (
    <div className={`rounded-[24px] bg-paper ring-1 ring-line shadow-card ${className}`} {...props}>
      {children}
    </div>
  );
}

// Animated segmented control (pill moves between options)
export function Segmented({ options, value, onChange, className = "", size = "md", label }) {
  const id = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`relative inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-paper p-1 ring-1 ring-line shadow-card no-scrollbar ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`relative z-0 shrink-0 whitespace-nowrap rounded-full font-semibold transition-colors ${
              size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-[15px]"
            } ${active ? "text-white" : "text-muted hover:text-ink"}`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 -z-10 rounded-full bg-forest-900 shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({ checked, onChange, label, hint }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4 py-2.5">
      <span className="min-w-0">
        <span className="block text-[15px] font-medium text-ink">{label}</span>
        {hint && <span className="block text-[13px] leading-snug text-muted">{hint}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="h-7 w-12 rounded-full bg-line-strong transition-colors peer-checked:bg-forest-700 peer-focus-visible:ring-2 peer-focus-visible:ring-sun" />
        <span className="pointer-events-none absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function RangeField({ label, value, min, max, step = 1, onChange, display }) {
  const id = useId();
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor={id} className="label !mb-0">
          {label}
        </label>
        <span className="rounded-full bg-leaf-soft px-2.5 py-0.5 text-sm font-bold text-forest-700">{display ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="field appearance-none pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-forest-700" aria-hidden="true" />
      </div>
    </div>
  );
}

export function Pill({ children, tone = "leaf", className = "" }) {
  const tones = {
    leaf: "bg-leaf-soft text-forest-700",
    sun: "bg-sun-soft text-soil",
    soil: "bg-soil-soft text-soil",
    danger: "bg-danger/10 text-danger",
    dark: "bg-forest-900 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Eyebrow({ children, dark = false, className = "" }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-semibold tracking-wide ${
        dark ? "bg-white/[0.06] text-lime ring-1 ring-white/10" : "bg-paper text-forest-700 ring-1 ring-line"
      } ${className}`}
    >
      <span className={`size-1.5 rounded-full ${dark ? "bg-lime" : "bg-forest-600"}`} aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, desc, align = "center", dark = false, size = "lg" }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2
        className={`display mt-5 font-bold ${
          size === "lg" ? "text-[34px] sm:text-5xl lg:text-[56px]" : "text-[28px] sm:text-4xl"
        } ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-5 text-[17px] leading-relaxed sm:text-lg ${align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"} ${
            dark ? "text-white/65" : "text-muted"
          }`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}

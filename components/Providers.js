"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

const ToastCtx = createContext(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export default function Providers({ children }) {
  const [toasts, setToasts] = useState([]);
  const seq = useRef(0);

  const toast = useCallback((message, type = "success") => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ToastCtx.Provider value={toast}>
        {children}
        <div
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        >
          <AnimatePresence initial={false}>
            {toasts.map((t) => {
              const Icon = t.type === "error" ? AlertCircle : t.type === "info" ? Info : CheckCircle2;
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="flex max-w-md items-center gap-2.5 rounded-full bg-night px-5 py-3 ring-1 ring-white/10 text-[15px] font-medium text-white shadow-lift"
                >
                  <Icon
                    className={`size-5 shrink-0 ${t.type === "error" ? "text-orange-300" : "text-lime"}`}
                    aria-hidden="true"
                  />
                  {t.message}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ToastCtx.Provider>
    </MotionConfig>
  );
}

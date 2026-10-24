"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/format";
import { Icon } from "./Icon";

type Kind = "success" | "error";
type ToastItem = { id: number; message: string; kind: Kind };
type ToastApi = { success: (message: string) => void; error: (message: string) => void };

const ToastContext = createContext<ToastApi | null>(null);

const LIFETIME: Record<Kind, number> = { success: 3500, error: 6000 };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, kind: Kind) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-3), { id, message, kind }]);
      window.setTimeout(() => dismiss(id), LIFETIME[kind]);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:bottom-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout={!reduceMotion}
              role={toast.kind === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-xl",
                toast.kind === "error" ? "bg-coral" : "bg-ink",
              )}
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/20">
                <Icon name={toast.kind === "error" ? "close" : "check"} size={12} />
              </span>
              <p className="flex-1">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss"
                className="opacity-70 hover:opacity-100"
              >
                <Icon name="close" size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

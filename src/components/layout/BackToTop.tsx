"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 800));
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <button
        type="button"
        onClick={toTop}
        className="flex items-center gap-2 font-semibold text-ink"
      >
        Back to top <Icon name="arrowUp" size={14} />
      </button>
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-30 grid size-12 place-items-center rounded-full bg-white text-ink shadow-lg"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ y: -3 }}
          >
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#eee" strokeWidth="2" />
              <motion.circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ pathLength: scrollYProgress }}
              />
            </svg>
            <Icon name="arrowUp" size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

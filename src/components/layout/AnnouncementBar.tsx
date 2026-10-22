"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

export function AnnouncementBar() {
  const messages = siteConfig.announcements;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div className="bg-ink text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center overflow-hidden px-4 text-xs font-medium">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            className="flex items-center gap-2"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-live="polite"
          >
            <Icon name="truck" size={15} />
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

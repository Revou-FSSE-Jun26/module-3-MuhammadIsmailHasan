"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-32 px-4 pt-24 sm:px-6">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Need help?</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Our common questions
        </h2>
      </Reveal>
      <RevealGroup className="mt-8 divide-y divide-line border-y border-line">
        {siteConfig.faqs.map((item, i) => {
          const isOpen = open === i;
          const id = `faq-${i}`;
          return (
            <RevealItem key={item.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={id}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold transition-colors hover:text-accent"
                >
                  {item.q}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-line"
                  >
                    <Icon name="chevronDown" size={16} />
                  </motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={id}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 pr-12 text-muted">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}

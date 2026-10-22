"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export function Features() {
  return (
    <section className="border-b border-line">
      <RevealGroup className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        {siteConfig.features.map((f) => (
          <RevealItem key={f.title}>
            <motion.div className="group flex items-start gap-4" whileHover="hover">
              <motion.span
                className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f3f3f3] text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-white"
                variants={{ hover: { rotate: [0, -12, 10, 0], transition: { duration: 0.6 } } }}
              >
                <Icon name={f.icon} size={26} />
              </motion.span>
              <div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </div>
            </motion.div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

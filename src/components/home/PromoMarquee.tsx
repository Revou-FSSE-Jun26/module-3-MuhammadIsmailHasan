"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { siteConfig } from "@/lib/site";

function MarqueeRow({ words, outline }: { words: string[]; outline?: boolean }) {
  return (
    <div className="marquee flex overflow-hidden">
      <div
        className="flex shrink-0 animate-marquee items-center"
        style={{ "--marquee-duration": "28s" } as CSSProperties}
      >
        {/* content is doubled so translateX(-50%) loops seamlessly */}
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span
              className={
                outline
                  ? "px-6 text-4xl font-extrabold uppercase tracking-tight text-transparent [-webkit-text-stroke:1px_white] sm:text-6xl"
                  : "px-6 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-6xl"
              }
            >
              {w}
            </span>
            <span className="text-3xl text-coral">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function PromoMarquee() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-15%", "0%"]);
  const words = [...siteConfig.promoMarquee, ...siteConfig.promoMarquee];

  return (
    <section
      ref={ref}
      className="overflow-hidden bg-ink py-8"
      aria-label={siteConfig.promoMarquee.join(", ")}
    >
      <motion.div style={{ x: x1 }} aria-hidden="true">
        <MarqueeRow words={words} />
      </motion.div>
      <motion.div style={{ x: x2 }} className="mt-3" aria-hidden="true">
        <MarqueeRow words={words} outline />
      </motion.div>
    </section>
  );
}

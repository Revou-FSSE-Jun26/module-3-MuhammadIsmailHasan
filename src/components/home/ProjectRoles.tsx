"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/product/ProductCard";
import { siteConfig } from "@/lib/site";

export function Testimonials() {
  const items = siteConfig.testimonials;
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const go = (d: number) => setState(([i]) => [(i + d + items.length) % items.length, d]);

  useEffect(() => {
    const id = window.setTimeout(() => setState(([i]) => [(i + 1) % items.length, 1]), 7000);
    return () => window.clearTimeout(id);
  }, [index, items.length]);

  const t = items[index];
  const initials =
    t.name
      .replace(/[^A-Za-z ]/g, "")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2) || "★";

  return (
    <section className="mx-auto max-w-4xl px-4 pt-24 sm:px-6">
      <Reveal className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">What clients say</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className="grid size-11 place-items-center rounded-full border border-line transition hover:border-ink hover:bg-ink hover:text-white"
            aria-label="Previous review"
          >
            <Icon name="arrowLeft" size={16} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="grid size-11 place-items-center rounded-full border border-line transition hover:border-ink hover:bg-ink hover:text-white"
            aria-label="Next review"
          >
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </Reveal>

      <Reveal
        delay={0.15}
        className="relative mt-8 overflow-hidden rounded-3xl bg-[#f7f7f7] p-6 sm:p-10"
      >
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.figure
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <figcaption className="flex shrink-0 flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm sm:w-48">
              <span className="grid size-16 place-items-center rounded-full bg-ink text-lg font-bold text-white">
                {initials}
              </span>
              <span className="mt-3 text-sm font-bold">{t.name}</span>
              <span className="text-xs text-muted">{t.role}</span>
            </figcaption>
            <blockquote className="relative">
              <Stars rate={t.rating} size={16} />
              <p className="mt-3 text-xl font-bold">{t.title}</p>
              <p className="mt-2 text-muted">{t.quote}</p>
              <Icon name="quote" size={48} className="ml-auto mt-4 text-accent" strokeWidth={2.2} />
            </blockquote>
          </motion.figure>
        </AnimatePresence>
      </Reveal>

      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, i) => (
          <motion.span
            key={i}
            className="h-1.5 rounded-full bg-ink"
            animate={{ width: i === index ? 28 : 8, opacity: i === index ? 1 : 0.25 }}
          />
        ))}
      </div>
    </section>
  );
}

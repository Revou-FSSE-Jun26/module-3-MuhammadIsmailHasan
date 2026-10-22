"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Icon } from "./Icon";
import { SplitText } from "./Reveal";
import { cn } from "@/lib/format";

/**
 * Section title with an optional huge outlined "ghost" word behind it
 * that slides sideways as you scroll.
 */
export function SectionHeading({
  title,
  eyebrow,
  ghost,
  link,
  className,
}: {
  title: string;
  eyebrow?: string;
  ghost?: string;
  link?: { href: string; label: string };
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-12%"]);

  return (
    <div ref={ref} className={cn("relative mb-10 flex items-end justify-between gap-6", className)}>
      {ghost && (
        <motion.span
          aria-hidden="true"
          style={{ x }}
          className="text-outline pointer-events-none absolute -top-10 left-0 select-none whitespace-nowrap text-[64px] font-extrabold leading-none sm:-top-14 sm:text-[110px]"
        >
          {ghost}
        </motion.span>
      )}
      <div className="relative">
        {eyebrow && (
          <motion.p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {eyebrow}
          </motion.p>
        )}
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          <SplitText text={title} />
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="group relative hidden shrink-0 items-center gap-2 text-sm font-semibold sm:flex"
        >
          {link.label}
          <span className="grid size-9 place-items-center rounded-full border border-line transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
            <Icon name="arrowRight" size={15} />
          </span>
        </Link>
      )}
    </div>
  );
}

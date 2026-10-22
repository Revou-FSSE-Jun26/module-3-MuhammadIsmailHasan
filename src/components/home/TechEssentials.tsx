"use client";

import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const CARD_TINTS = ["#bfe0ef", "#e7d6c8", "#d6e6d2", "#efd8e2", "#dcdcf2", "#f1e6c4"];

export function TechEssentials({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"]);

  if (!products.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative mt-24 bg-sky"
      style={{ height: `calc(100vh + ${distance}px)` }}
      aria-label="Tech essentials"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            Power your life
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            Your tech essentials, all in <span className="italic text-coral">one place</span>.
          </h2>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-10 flex w-max gap-6 pl-4 pr-[10vw] sm:pl-[max(1.5rem,calc((100vw_-_80rem)/2_+_1.5rem))]"
        >
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group relative flex h-[52vh] max-h-[460px] min-h-[320px] w-[72vw] max-w-[360px] shrink-0 flex-col overflow-hidden rounded-3xl p-6"
              style={{ background: CARD_TINTS[i % CARD_TINTS.length] }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">
                0{i + 1}
              </span>
              <div className="relative mt-2 flex-1 transition-transform duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:scale-105">
                <ProductImage src={p.image} alt={p.title} id={p.id} sizes="360px" />
              </div>
              <div className="flex items-end justify-between gap-3 rounded-2xl bg-white/80 p-4 backdrop-blur">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold">{p.title}</h3>
                  <p className="text-sm text-muted">{formatPrice(p.price)}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-[-45deg]">
                  <Icon name="arrowRight" size={16} />
                </span>
              </div>
            </Link>
          ))}
        </motion.div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-ink/10">
            <motion.div className="h-full bg-ink" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Scene } from "@/components/illustrations/Scene";
import { ProductImage } from "@/components/product/ProductImage";
import { Stars } from "@/components/product/ProductCard";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function Recommend({ product }: { product?: Product }) {
  const ref = useRef<HTMLElement>(null);
  const { add } = useCart();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const titleX = useTransform(scrollYProgress, [0, 1], [80, -40]);

  if (!product) return null;

  return (
    <section
      ref={ref}
      className="relative h-[620px] overflow-hidden sm:h-[760px]"
      aria-label="We recommend"
    >
      <Scene variant="dunes" palette="peach" parallax />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-end justify-center px-4 sm:px-6">
        <motion.div style={{ x: titleX }} className="mb-6 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/70">Our pick</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
            We recommend
          </h2>
        </motion.div>
        <motion.article
          style={{ y: cardY }}
          className="w-72 rounded-3xl bg-white p-4 shadow-2xl sm:w-80"
          whileHover={{ rotate: -1.5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Link
            href={`/products/${product.id}`}
            className="relative block aspect-square overflow-hidden rounded-2xl bg-[#f2f2f2]"
          >
            <ProductImage src={product.image} alt={product.title} id={product.id} sizes="320px" />
          </Link>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-sm font-semibold">{product.title}</h3>
              <div className="mt-1 flex items-center gap-2">
                <Stars rate={product.rating.rate} />
                <span className="text-xs text-muted">({product.rating.count})</span>
              </div>
            </div>
            <span className="shrink-0 font-bold">{formatPrice(product.price)}</span>
          </div>
          <button
            type="button"
            onClick={() => add(product)}
            className="mt-4 h-11 w-full rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-black"
          >
            Add to cart
          </button>
        </motion.article>
      </div>
    </section>
  );
}

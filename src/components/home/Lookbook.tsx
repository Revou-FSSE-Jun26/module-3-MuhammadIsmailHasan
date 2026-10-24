"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn, formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { Product } from "@/lib/types";

const SPOTS = [
  { left: 19, top: 62 },
  { left: 70, top: 45 },
  { left: 50, top: 80 },
];

export function Lookbook({ products }: { products: Product[] }) {
  const [active, setActive] = useState<number | null>(null);
  const { add } = useCart();
  const items = products.slice(0, SPOTS.length);

  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-label="Shop the look">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          {siteConfig.lookbook.eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
          {siteConfig.lookbook.title}
        </h2>
        <p className="mt-3 text-muted">Tap a + to see the product and add it to your cart.</p>
      </div>

      <Reveal y={60} className="relative mt-8 aspect-[5/3] rounded-3xl">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <Image
            src={siteConfig.lookbook.image}
            alt=""
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover"
          />
        </div>

        {items.map((p, i) => {
          const spot = SPOTS[i];
          const open = active === i;
          const alignRight = spot.left > 60;
          return (
            <div
              key={p.id}
              className="absolute"
              style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
            >
              <button
                type="button"
                onClick={() => setActive(open ? null : i)}
                className="relative -ml-5 -mt-5 grid size-10 place-items-center rounded-full bg-white text-ink shadow-lg"
                aria-expanded={open}
                aria-label={`Show product: ${p.title}`}
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
                <motion.span animate={{ rotate: open ? 45 : 0 }} className="relative">
                  <Icon name="plus" size={16} strokeWidth={2.4} />
                </motion.span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    className={cn(
                      "absolute bottom-8 z-10 w-64 rounded-2xl bg-white p-3 shadow-2xl",
                      alignRight ? "right-0" : "left-0",
                    )}
                    initial={{ opacity: 0, y: 16, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  >
                    <div className="flex gap-3">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2]">
                        <ProductImage
                          src={p.image}
                          alt={p.title}
                          id={p.id}
                          sizes="80px"
                          className="p-2"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${p.slug}`}
                          className="line-clamp-2 text-sm font-semibold hover:underline"
                        >
                          {p.title}
                        </Link>
                        <p className="mt-1 text-sm font-bold">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => add(p)}
                      className="mt-3 h-10 w-full rounded-full bg-ink text-xs font-semibold text-white hover:bg-black"
                    >
                      Add to cart
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}

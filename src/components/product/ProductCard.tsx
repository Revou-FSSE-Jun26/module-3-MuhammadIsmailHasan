"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/Icon";
import { cn, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";

export function Stars({ rate, size = 12 }: { rate: number; size?: number }) {
  return (
    <span
      className="flex items-center gap-0.5 text-amber-500"
      aria-label={`Rated ${rate.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={size} filled={i < Math.round(rate)} strokeWidth={1.4} />
      ))}
    </span>
  );
}

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { add, wishlist, toggleWish } = useCart();
  const [added, setAdded] = useState(false);
  const wished = wishlist.includes(product.id);
  const href = `/products/${product.slug}`;
  const soldOut = product.stock <= 0;

  function quickAdd() {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <motion.article
      className="group relative flex flex-col"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f2f2f2]">
        <Link href={href} className="absolute inset-0 block" aria-label={product.title}>
          <div className="relative h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-110">
            <ProductImage
              src={product.image}
              alt={product.title}
              id={product.id}
              priority={priority}
            />
          </div>
        </Link>

        <motion.button
          type="button"
          onClick={() => toggleWish(product.id)}
          whileTap={{ scale: 0.8 }}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white shadow-sm transition-all duration-300",
            wished
              ? "text-coral opacity-100"
              : "text-ink lg:translate-x-3 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100",
          )}
        >
          <Icon name="heart" size={18} filled={wished} />
        </motion.button>

        <div className="absolute inset-x-3 bottom-3 transition-all duration-500 ease-out-expo lg:translate-y-[140%] lg:group-hover:translate-y-0 lg:group-focus-within:translate-y-0">
          <button
            type="button"
            onClick={quickAdd}
            disabled={soldOut}
            className="relative flex h-11 w-full items-center justify-center overflow-hidden rounded-full bg-ink text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  className="flex items-center gap-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                >
                  <Icon name="check" size={16} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  className="flex items-center gap-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                >
                  <Icon name="bag" size={16} /> Quick add
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
          {product.subCategory || "RevoShop"}
        </p>
        <Link
          href={href}
          className="line-clamp-2 text-sm font-semibold leading-snug hover:underline"
        >
          {product.title}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-sm font-bold">{formatPrice(product.price)}</span>
          <span className={cn("text-xs", product.stock > 0 ? "text-muted" : "text-coral")}>
            {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

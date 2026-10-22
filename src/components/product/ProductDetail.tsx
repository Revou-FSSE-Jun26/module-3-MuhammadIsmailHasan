"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type MouseEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { QuantityStepper } from "@/components/cart/CartDrawer";
import { Icon } from "@/components/ui/Icon";
import { categoryLabel, cn, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Stars } from "./ProductCard";
import { ProductImage } from "./ProductImage";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductDetail({ product }: { product: Product }) {
  const { add, wishlist, toggleWish } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const wished = wishlist.includes(product.id);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      active: true,
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  function onAdd() {
    add(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-[#f2f2f2]"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
      >
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out"
          style={{
            transform: zoom.active ? "scale(1.8)" : "scale(1)",
            transformOrigin: `${zoom.x}% ${zoom.y}%`,
          }}
        >
          <ProductImage
            src={product.image}
            alt={product.title}
            id={product.id}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="p-12"
          />
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.15,
            },
          },
        }}
        className="flex flex-col"
      >
        {[
          <p key="cat" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {categoryLabel(product.category)}
          </p>,
          <h1
            key="title"
            className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
          >
            {product.title}
          </h1>,
          <div key="rating" className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Stars rate={product.rating.rate} size={16} /> {product.rating.rate.toFixed(1)} ·{" "}
            {product.rating.count} reviews
          </div>,
          <p key="price" className="mt-6 text-3xl font-bold">
            {formatPrice(product.price)}
          </p>,
          <p key="desc" className="mt-6 leading-relaxed text-muted">
            {product.description}
          </p>,
          <div key="actions" className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={qty}
              onChange={(v) => setQty(Math.max(1, v))}
              label={product.title}
            />
            <motion.button
              type="button"
              onClick={onAdd}
              whileTap={{ scale: 0.97 }}
              className="relative h-12 flex-1 overflow-hidden rounded-full bg-ink px-8 text-sm font-semibold text-white hover:bg-black"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? "added" : "add"}
                  className="flex items-center justify-center gap-2"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                >
                  <Icon name={added ? "check" : "bag"} size={17} />
                  {added ? "Added to cart" : "Add to cart"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => toggleWish(product.id)}
              whileTap={{ scale: 0.85 }}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "grid size-12 place-items-center rounded-full border border-line",
                wished && "text-coral",
              )}
            >
              <Icon name="heart" filled={wished} />
            </motion.button>
          </div>,
          <ul key="perks" className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            <li className="flex items-center gap-3">
              <Icon name="truck" size={18} /> Free shipping on orders over $100
            </li>
            <li className="flex items-center gap-3">
              <Icon name="shield" size={18} /> 30-day returns & 1-year warranty
            </li>
          </ul>,
        ].map((node) => (
          <motion.div
            key={node.key}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: EASE },
              },
            }}
          >
            {node}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

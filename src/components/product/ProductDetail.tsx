"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type MouseEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { QuantityStepper } from "@/components/cart/CartDrawer";
import { Icon } from "@/components/ui/Icon";
import { cn, formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductDetail({ product }: { product: Product }) {
  const { add, wishlist, toggleWish, canShop } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const [index, setIndex] = useState(0);
  const wished = wishlist.includes(product.id);
  const gallery = product.images.length ? product.images : [product.image];
  const soldOut = product.stock <= 0;

  function showNext() {
    setIndex((i) => (i + 1) % gallery.length);
  }

  function showPrev() {
    setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  }

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
      <div className="flex flex-col gap-4">
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <ProductImage
                  src={gallery[index] ?? ""}
                  alt={product.title}
                  id={product.id}
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="p-12"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow-sm"
              >
                <Icon name="arrowRight" size={16} className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow-sm"
              >
                <Icon name="arrowRight" size={16} />
              </button>
            </>
          )}
        </motion.div>

        {gallery.length > 1 && (
          <ul className="flex gap-3 overflow-x-auto p-3" aria-label="Product images">
            {gallery.map((src, i) => (
              <li key={`${src}-${i}`}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "relative block size-20 overflow-hidden rounded-xl bg-[#f2f2f2] ring-2 transition",
                    i === index ? "ring-ink" : "ring-transparent hover:ring-line",
                  )}
                >
                  <ProductImage src={src} alt="" id={product.id} sizes="80px" className="p-2" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
            {product.subCategory}
          </p>,
          <h1
            key="title"
            className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
          >
            {product.title}
          </h1>,
          <p key="stock" className={cn("mt-3 text-sm", soldOut ? "text-coral" : "text-muted")}>
            Sold by{" "}
            <b className="font-semibold text-ink">{product.seller?.name ?? siteConfig.name}</b> ·{" "}
            {soldOut ? "Sold out" : `${product.stock} in stock`}
          </p>,
          <p key="price" className="mt-6 text-3xl font-bold">
            {formatPrice(product.price)}
          </p>,
          <p key="desc" className="mt-6 leading-relaxed text-muted">
            {product.description}
          </p>,
          <div key="actions" className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={qty}
              onChange={(v) => setQty(Math.min(Math.max(1, v), Math.max(product.stock, 1)))}
              label={product.title}
            />
            <motion.button
              type="button"
              onClick={onAdd}
              disabled={soldOut || !canShop}
              title={canShop ? undefined : "Only buyer accounts can add to cart"}
              whileTap={canShop ? { scale: 0.97 } : undefined}
              className="relative h-12 flex-1 overflow-hidden rounded-full bg-ink px-8 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
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
                  {!canShop ? "Buyer accounts only" : added ? "Added to cart" : "Add to cart"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => toggleWish(product.id)}
              disabled={!canShop}
              title={canShop ? undefined : "Wishlist is for buyer accounts only"}
              whileTap={canShop ? { scale: 0.85 } : undefined}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "grid size-12 place-items-center rounded-full border border-line",
                !canShop && "cursor-not-allowed text-muted opacity-50",
                wished && "text-coral",
              )}
            >
              <Icon name="heart" filled={wished} />
            </motion.button>
          </div>,
          <ul key="perks" className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            <li className="flex items-center gap-3">
              <Icon name="truck" size={18} /> Free shipping on orders over{" "}
              {formatPrice(siteConfig.freeShippingThreshold)}
            </li>
            <li className="flex items-center gap-3">
              <Icon name="shield" size={18} /> Track your order from your dashboard
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

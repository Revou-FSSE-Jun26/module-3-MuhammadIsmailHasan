"use client";

import Image from "next/image";
import { useState } from "react";

import Card from "@/app/components/ui/Card";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type Badge = "new" | "sale" | "best-seller";

interface ProductCardProps {
  product: Product;
  badge?: Badge;
  rating?: number;
  reviewCount?: number;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const BADGE_STYLES: Record<Badge, { label: string; className: string }> = {
  new: { label: "New", className: "bg-brand-600 text-white" },
  sale: { label: "Sale", className: "bg-promo-600 text-white" },
  "best-seller": { label: "Best Seller", className: "bg-accent-500 text-white" },
};

const PLACEHOLDER_TINTS = [
  "bg-tint-lilac",
  "bg-tint-blue",
  "bg-tint-mint",
  "bg-tint-peach",
];

export function getButtonClasses(inStock: boolean): string {
  const base =
    "h-10 flex-1 rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 cursor-pointer";

  return inStock
    ? `${base} bg-brand-600 text-white hover:bg-brand-700`
    : `${base} cursor-not-allowed bg-muted text-neutral-400`;
}

export default function ProductCard({
  product,
  badge,
  rating,
  reviewCount = 0,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);

  const inStock = product.stock > 0;
  const maxQuantity = Math.max(product.stock, 1);
  const imageSrc = imageFailed ? null : product.image;
  const tint = PLACEHOLDER_TINTS[product.id % PLACEHOLDER_TINTS.length];

  return (
    <Card className="flex flex-col">
      <div className={`relative aspect-square ${tint}`}>
        {badge && (
          <span
            className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_STYLES[badge].className}`}
          >
            {BADGE_STYLES[badge].label}
          </span>
        )}

        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-6"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span
            aria-hidden
            className="flex h-full w-full items-center justify-center text-5xl font-semibold text-neutral-900/15"
          >
            {product.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">
          {product.name}
        </h3>

        {rating !== undefined && (
          <p className="flex items-center gap-1 text-xs text-neutral-500">
            <span aria-hidden className="text-amber-400">
              {"★".repeat(Math.round(rating))}
              <span className="text-neutral-300">{"★".repeat(5 - Math.round(rating))}</span>
            </span>
            <span className="sr-only">{rating} out of 5</span>
            {reviewCount > 0 && <span>({reviewCount})</span>}
          </p>
        )}

        <p className="mt-auto pt-1 text-base font-bold tabular-nums text-neutral-900">
          {formatPrice(product.price)}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="flex h-10 items-center rounded-full bg-muted">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={!inStock || quantity <= 1}
              aria-label="Decrease quantity"
              className="h-10 w-9 rounded-full text-neutral-600 disabled:text-neutral-300 hover:bg-gray-200 cursor-pointer"
            >
              −
            </button>
            <span className="w-5 text-center text-sm font-medium tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              disabled={!inStock || quantity >= maxQuantity}
              aria-label="Increase quantity"
              className="h-10 w-9 rounded-full text-neutral-600 disabled:text-neutral-300 hover:bg-gray-200 cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={!inStock}
            onClick={() => onAddToCart?.(product, quantity)}
            className={getButtonClasses(inStock)}
          >
            {inStock ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </div>
    </Card>
  );
}

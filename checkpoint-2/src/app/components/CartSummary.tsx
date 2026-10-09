"use client";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

interface CartSummaryProps {
  items: Product[];
}

export default function CartSummary({ items }: CartSummaryProps) {
  const itemCount: number = items.length;
  const total: number = items.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="flex items-center gap-4 rounded-full bg-brand-50 py-2 pl-5 pr-2">
      <div className="text-sm">
        <span className="font-medium text-neutral-900">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="mx-2 text-neutral-300">|</span>
        <span className="font-bold tabular-nums text-brand-700">{formatPrice(total)}</span>
      </div>

      <button
        type="button"
        disabled={itemCount === 0}
        className="h-9 rounded-full bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        Checkout
      </button>
    </div>
  );
}

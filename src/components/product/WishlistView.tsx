"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Spinner } from "@/components/ui/Spinner";
import { productApi, toProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const noopSubscribe = () => () => {};

export function WishlistView() {
  const { wishlist } = useCart();
  const requested = useRef(new Set<number>());
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [byId, setById] = useState<Record<number, Product>>({});
  const [settled, setSettled] = useState<number[]>([]);

  useEffect(() => {
    const missing = wishlist.filter((id) => !requested.current.has(id));
    if (missing.length === 0) return;
    missing.forEach((id) => requested.current.add(id));
    Promise.allSettled(missing.map((id) => productApi.get(id))).then((results) => {
      const fetched: Record<number, Product> = {};
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          const product = toProduct(result.value);
          fetched[product.id] = product;
        }
      });
      setById((prev) => ({ ...prev, ...fetched }));
      setSettled((prev) => [...prev, ...missing]);
    });
  }, [wishlist]);

  const products = wishlist.map((id) => byId[id]).filter((p): p is Product => p !== undefined);
  const pending = !ready || wishlist.some((id) => !settled.includes(id));

  if (pending && products.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 py-24 text-sm text-muted">
        <Spinner className="size-6 text-ink" /> Loading your wishlist…
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-line px-6 py-20 text-center">
        <p className="text-lg font-bold">Your wishlist is empty</p>
        <p className="mt-2 text-sm text-muted">Tap the heart on a product to save it here.</p>
        <Link
          href="/collections/all"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-black"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-3 text-sm text-muted">
        {products.length} {products.length === 1 ? "item" : "items"} saved on this device
      </p>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {products.map((p, i) => (
          <li key={p.id}>
            <ProductCard product={p} priority={i < 4} />
          </li>
        ))}
      </ul>
    </>
  );
}

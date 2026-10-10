"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import AddProductForm from "@/app/components/AddProductForm";
import CartSummary from "@/app/components/CartSummary";
import CategoryFilter from "@/app/components/CategoryFilter";
import ProductGrid from "@/app/components/ProductGrid";
import ProductGridSkeleton from "@/app/components/ui/ProductGridSkeleton";
import SearchBar from "@/app/components/SearchBar";
import { fetchProducts } from "@/lib/client-api";
import type { Product } from "@/types/product";

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  const currentKey = `${search}|${categoryId}`;
  const [loadedKey, setLoadedKey] = useState(currentKey);
  const isLoading = loadedKey !== currentKey;

  useEffect(() => {
    let cancelled = false;
    fetchProducts({search, categoryId})
      .then((response) => {
          if (!cancelled) setProducts(response);
        })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadedKey(currentKey);
      })

    return () => {cancelled = true}
  }, [search, categoryId, currentKey]);

  function handleAddToCart(product: Product, quantity: number) {
    if (quantity <= 0) return;

    setCart((currentCart) => [
      ...currentCart,
      ...Array.from({ length: quantity }, () => product),
    ]);
  }

  function handleAddProduct(product: Product) {
    setProducts((currentProducts) => [product, ...currentProducts]);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar defaultValue={search} />
          <CategoryFilter value={categoryId} onChange={setCategoryId} />
        </div>
        <CartSummary items={cart} />
      </div>

      {search && (
        <p className="text-sm text-neutral-500">
          Showing results for <span className="font-medium text-neutral-900">{search}</span>
        </p>
      )}

      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      )}

      <AddProductForm onAddProduct={handleAddProduct} />
    </div>
  );
}

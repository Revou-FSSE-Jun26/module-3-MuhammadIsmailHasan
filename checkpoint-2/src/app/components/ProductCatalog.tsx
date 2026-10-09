"use client";

import { useState } from "react";

import AddProductForm from "@/app/components/AddProductForm";
import CartSummary from "@/app/components/CartSummary";
import ProductGrid from "@/app/components/ProductGrid";
import SearchBar from "@/app/components/SearchBar";
import type { Product } from "@/types/product";

interface ProductCatalogProps {
  initialProducts: Product[];
}

export default function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Product[]>([]);

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

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
        <SearchBar value={query} onChange={setQuery} />
        <CartSummary items={cart} />
      </div>

      <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />

      <AddProductForm onAddProduct={handleAddProduct} />
    </div>
  );
}

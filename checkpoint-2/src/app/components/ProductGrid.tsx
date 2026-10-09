import ProductCard from "@/app/components/ProductCard";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product, quantity: number) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
        <p className="text-sm font-medium text-neutral-900">No products match your search</p>
        <p className="mt-1 text-sm text-neutral-500">Try a shorter keyword or pick another category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

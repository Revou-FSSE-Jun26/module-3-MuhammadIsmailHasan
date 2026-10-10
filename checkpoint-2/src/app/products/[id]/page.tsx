import type { Metadata } from "next";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import { getProductById } from "@/lib/api";


export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    return {
      title: product.name,
      description: product.description,
    };
  } catch {
    return {
      title: "Product not found",
      description: "Product not found.",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProductById(id);

  const inStock = product.stock > 0;

  return (
    <article className="grid gap-10 lg:grid-cols-2">
      <div className="aspect-square rounded-2xl bg-tint-lilac" />

      <div>
        <nav className="text-sm text-neutral-500">
          <Link href="/products" className="transition-colors hover:text-neutral-900">
            Products
          </Link>
          {product.category && <span> / {product.category.name}</span>}
        </nav>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
          {product.name}
        </h2>

        <p className="mt-4 text-2xl font-bold tabular-nums text-neutral-900">
          {formatPrice(product.price)}
        </p>

        <p
          className={`mt-2 text-sm font-medium ${inStock ? "text-emerald-600" : "text-neutral-400"}`}
        >
          {inStock ? `${product.stock} in stock` : "Out of stock"}
        </p>

        {product.description && (
          <p className="mt-6 max-w-prose leading-relaxed text-neutral-600">
            {product.description}
          </p>
        )}
      </div>
    </article>
  );
}

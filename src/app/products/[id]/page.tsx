import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProduct, getProductsByCategory } from "@/lib/api";
import { categoryHref, categoryLabel } from "@/lib/format";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(Number(id));
  return {
    title: product?.title ?? "Product not found",
    description: product?.description.slice(0, 150),
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = Number.isFinite(Number(id)) ? await getProduct(Number(id)) : null;
  if (!product) notFound();

  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 5);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>{" "}
          /{" "}
          <Link href={categoryHref(product.category)} className="hover:text-ink">
            {categoryLabel(product.category)}
          </Link>{" "}
          / <span className="text-ink">{product.title}</span>
        </nav>
        <ProductDetail product={product} />
      </div>
      <ProductGrid title="You may also like" eyebrow="Related" products={related} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProduct, getProducts } from "@/lib/api";
import { categoryHref } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = slug ? await getProduct(slug) : null;
  return {
    title: product?.title ?? "Product not found",
    description: product?.description.slice(0, 150),
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = slug ? await getProduct(slug) : null;
  if (!product) notFound();

  const related = product.subCategoryId
    ? (await getProducts({ sub_category_id: product.subCategoryId, limit: 6 })).items
        .filter((p) => p.slug !== product.slug)
        .slice(0, 5)
    : [];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>{" "}
          /{" "}
          {product.categoryId && product.subCategoryId ? (
            <>
              <Link
                href={categoryHref(product.categoryId, product.subCategoryId)}
                className="hover:text-ink"
              >
                {product.subCategory}
              </Link>{" "}
              /{" "}
            </>
          ) : null}
          <span className="text-ink">{product.title}</span>
        </nav>
        <ProductDetail product={product} />
      </div>
      <ProductGrid title="You may also like" eyebrow="Related" products={related} />
    </>
  );
}

"use client";

import Link from "next/link";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { productApi } from "@/lib/api";
import type { Role } from "@/lib/types";
import { ImageManager } from "./ImageManager";
import { PageHeader } from "./PageHeader";
import { ProductForm } from "./ProductForm";
import { QueryView } from "./QueryView";

export function ProductEditor({
  role,
  slug,
}: {
  role: Extract<Role, "seller" | "admin">;
  slug?: string;
}) {
  const base = `/dashboard/${role}/products`;
  const { state, reload } = useAuthedQuery(`product-${slug ?? "new"}`, () =>
    slug ? productApi.getBySlug(slug, true) : Promise.resolve(null),
  );

  return (
    <>
      <PageHeader
        title={slug ? "Edit product" : "New product"}
        description={slug ? undefined : "Add the details first, then upload images."}
        action={
          <Link href={base} className="text-sm font-semibold underline underline-offset-4">
            Back to products
          </Link>
        }
      />
      <QueryView state={state} reload={reload}>
        {(product) => (
          <div className="grid items-start gap-6 xl:grid-cols-2">
            <ProductForm key={product?.id ?? "new"} role={role} product={product ?? undefined} />
            {product ? (
              <ImageManager productId={product.id} />
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
                <p className="font-semibold text-ink">Images</p>
                <p className="mt-1">Save the product first, then upload its images here.</p>
              </div>
            )}
          </div>
        )}
      </QueryView>
    </>
  );
}

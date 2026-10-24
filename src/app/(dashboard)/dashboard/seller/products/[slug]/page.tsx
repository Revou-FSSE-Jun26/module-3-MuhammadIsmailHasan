import type { Metadata } from "next";
import { ProductEditor } from "@/components/dashboard/ProductEditor";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductEditor role="seller" slug={decodeURIComponent(slug)} />;
}

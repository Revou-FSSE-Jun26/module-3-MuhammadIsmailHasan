import type { Metadata } from "next";
import { ProductEditor } from "@/components/dashboard/ProductEditor";

export const metadata: Metadata = { title: "New product" };

export default function NewProductPage() {
  return <ProductEditor role="seller" />;
}

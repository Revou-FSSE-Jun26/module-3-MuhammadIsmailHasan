import type { Metadata } from "next";
import { ProductsManager } from "@/components/dashboard/ProductsManager";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return <ProductsManager role="seller" />;
}

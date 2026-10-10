import type { Metadata } from "next";

import ProductList from "@/app/components/ProductList";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse every product available on RevoShop.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { search } = await searchParams;
  const query = typeof search === "string" ? search : undefined;

  const { products } = await getProducts({ search: query });

  return <ProductList initialProducts={products} />;
}

import Link from "next/link";

import ProductCard from "@/app/components/ProductCard";
import { getProducts } from "@/lib/api";

export default async function Home() {
  const { products } = await getProducts({ limit: 5 });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <section className="overflow-hidden rounded-3xl bg-brand-50 px-8 py-14 sm:px-12">
        <p className="text-sm font-medium text-brand-700">Free delivery over Rp500.000</p>
        <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
          Everything you need, delivered across Indonesia.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600">
          Electronics, clothing and groceries from sellers you can check before you buy.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex h-11 items-center rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Browse products
        </Link>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Featured products</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-600"
          >
            View all products
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { getCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Categories",
  description: "Shop RevoShop by category.",
};

const TINTS = ["bg-tint-lilac", "bg-tint-blue", "bg-tint-mint", "bg-tint-peach"];

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Shop by category</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className={`rounded-2xl p-6 transition-transform hover:-translate-y-0.5 ${TINTS[index % TINTS.length]}`}
          >
            <h2 className="text-base font-semibold text-neutral-900">{category.name}</h2>
            <p className="mt-10 text-sm font-medium text-brand-700">Shop now →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

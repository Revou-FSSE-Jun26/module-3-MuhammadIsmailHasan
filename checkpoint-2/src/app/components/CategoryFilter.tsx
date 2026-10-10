"use client";

import { useEffect, useState } from "react";

import { fetchCategories } from "@/lib/client-api";
import type { Category } from "@/types/product";

interface CategoryFilterProps {
  value: number | null;
  onChange: (categoryId: number | null) => void;
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then((response) => {
      setCategories(response);
    })
    .catch(() => {setCategories([])});
  }, []);


  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Filter by category</span>
      <select
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value === "" ? null : Number(event.target.value))
        }
        className="h-11 appearance-none rounded-full border border-neutral-200 bg-surface pl-4 pr-10 text-sm text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-4 h-4 w-4 text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

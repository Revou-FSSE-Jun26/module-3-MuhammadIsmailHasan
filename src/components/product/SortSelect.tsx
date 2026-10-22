"use client";

import { usePathname, useRouter } from "next/navigation";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export function SortSelect({ value, query }: { value: string; query?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Sort by</span>
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams();
          if (query) next.set("q", query);
          next.set("sort", e.target.value);
          router.push(`${pathname}?${next.toString()}`, { scroll: false });
        }}
        className="h-10 rounded-full border border-line bg-white px-4 font-medium outline-none focus:border-ink"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

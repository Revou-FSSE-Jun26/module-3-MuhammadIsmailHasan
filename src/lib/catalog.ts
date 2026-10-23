import type { Category } from "./types";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured", sort_by: "id", order: "asc" },
  { value: "newest", label: "Newest", sort_by: "created_at", order: "desc" },
  { value: "price-asc", label: "Price: low to high", sort_by: "price", order: "asc" },
  { value: "price-desc", label: "Price: high to low", sort_by: "price", order: "desc" },
] as const;

export function sortToQuery(value: string) {
  const found = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];
  return { sort_by: found.sort_by, order: found.order };
}

export function resolveSubCategoryIds(
  categories: Category[],
  categoryId: number | null,
  subId: number | null,
): number[] {
  if (subId) return [subId];
  return categories.find((c) => c.id === categoryId)?.sub_categories?.map((s) => s.id) ?? [];
}

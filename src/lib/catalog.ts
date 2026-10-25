import type { Category, Product, SubCategory } from "./types";

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

export function pickDiverse(products: Product[], count: number): Product[] {
  const groups = new Map<string, Product[]>();
  for (const p of products) {
    const key = String(p.categoryId ?? p.subCategoryId ?? "none");
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  const queues = [...groups.values()];
  const picked: Product[] = [];
  while (picked.length < count && queues.some((q) => q.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && picked.length < count) picked.push(next);
    }
  }
  return picked;
}

export function pickCollections(categories: Category[], count: number): SubCategory[] {
  const queues = categories.map((c) =>
    [...(c.sub_categories ?? [])].sort((a, b) => Number(!!b.image) - Number(!!a.image)),
  );
  const picked: SubCategory[] = [];
  while (picked.length < count && queues.some((q) => q.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && picked.length < count) picked.push(next);
    }
  }
  return picked;
}

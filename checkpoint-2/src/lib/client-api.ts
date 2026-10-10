import type { Category, Product } from "@/types/product";

/**
 * Browser-side data access. These call this app's own /api routes rather than
 * the RevoShop API, because the API sends no CORS headers — see the
 * route handlers under src/app/api. Server Components keep using @/lib/api.
 */

async function requestJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, { signal });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}

export function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  return requestJson<Category[]>("/api/categories", signal);
}

export function fetchProducts(
  query: { search?: string; categoryId?: number | null },
  signal?: AbortSignal,
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.categoryId != null) params.set("category_id", String(query.categoryId));

  const suffix = params.toString() ? `?${params}` : "";
  return requestJson<Product[]>(`/api/products${suffix}`, signal);
}

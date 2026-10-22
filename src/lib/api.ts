import { fallbackProducts } from "./fallback-products";
import type { Product } from "./types";

/**
 * Data layer — FakeStore API (https://fakestoreapi.com).
 * Every call falls back to local sample data so the theme still renders
 * when the API is down or rate-limited.
 *
 * To switch API, change NEXT_PUBLIC_API_URL and adapt `normalize()`.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://fakestoreapi.com";
const REVALIDATE_SECONDS = 60 * 60;

async function request<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[api] ${path} failed, using fallback data:`, error);
    return fallback;
  }
}

function normalize(p: Partial<Product>): Product {
  return {
    id: Number(p.id),
    title: p.title ?? "Untitled product",
    price: Number(p.price ?? 0),
    description: p.description ?? "",
    category: p.category ?? "uncategorized",
    image: p.image ?? "",
    rating: p.rating ?? { rate: 0, count: 0 },
  };
}

export async function getProducts(): Promise<Product[]> {
  const data = await request<Partial<Product>[]>("/products", fallbackProducts);
  return Array.isArray(data) ? data.map(normalize) : fallbackProducts;
}

export async function getProduct(id: number): Promise<Product | null> {
  const fallback = fallbackProducts.find((p) => p.id === id) ?? null;
  const data = await request<Partial<Product> | null>(`/products/${id}`, fallback);
  // FakeStore returns an empty body (null) for unknown ids
  return data && data.id ? normalize(data) : null;
}

export async function getCategories(): Promise<string[]> {
  const fallback = Array.from(new Set(fallbackProducts.map((p) => p.category)));
  const data = await request<string[]>("/products/categories", fallback);
  return Array.isArray(data) && data.length ? data : fallback;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === "all") return getProducts();
  const fallback = fallbackProducts.filter((p) => p.category === category);
  const data = await request<Partial<Product>[]>(
    `/products/category/${encodeURIComponent(category)}`,
    fallback,
  );
  return Array.isArray(data) ? data.map(normalize) : fallback;
}

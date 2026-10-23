import type {
  ApiEnvelope,
  Category,
  CreateOrderPayload,
  LoginResponse,
  Order,
  OrderStatus,
  Paginated,
  Product,
  ProductDetail,
  ProductQuery,
  ProductSummary,
  RegisterPayload,
  SubCategory,
  User,
} from "./types";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1"
).replace(/\/$/, "");

const API_ORIGIN = new URL(API_BASE_URL).origin;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | undefined>;
  revalidate?: number | false;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${API_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, query, revalidate, headers, ...init } = options;
  const isForm = body instanceof FormData;

  const res = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body && !isForm ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.status === false) {
    throw new ApiError(res.status, json?.message ?? res.statusText);
  }

  return json as T;
}

/** Backend may return "/static/images/x.jpg" — make it absolute for <img>/next/image. */
export function imageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

const unwrap = <T>(env: ApiEnvelope<T>) => env.data as T;
const paged = <T>(env: ApiEnvelope<T[]>): Paginated<T> => ({
  items: env.data ?? [],
  pagination: env.pagination ?? null,
});

// ---------- Auth ----------
export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/auth/login", { method: "POST", body: { email, password } }),
  refresh: (refreshToken: string) =>
    request<ApiEnvelope<never> & { access_token: string }>("/auth/refresh", {
      method: "POST",
      token: refreshToken,
    }),
  register: (payload: RegisterPayload) =>
    request<ApiEnvelope<User>>("/users/", { method: "POST", body: payload }).then(unwrap),
  me: (token: string) => request<ApiEnvelope<User>>("/users/me", { token }).then(unwrap),
};

// ---------- Catalog ----------
const CATALOG_REVALIDATE = 60;

export const productApi = {
  list: (query: ProductQuery = {}) =>
    request<ApiEnvelope<ProductSummary[]>>("/products/", {
      query,
      revalidate: CATALOG_REVALIDATE,
    }).then(paged),
  get: (id: number) =>
    request<ApiEnvelope<ProductDetail>>(`/products/${id}`, {
      revalidate: CATALOG_REVALIDATE,
    }).then(unwrap),
  getBySlug: (slug: string) =>
    request<ApiEnvelope<ProductDetail>>(`/products/slug/${encodeURIComponent(slug)}`, {
      revalidate: CATALOG_REVALIDATE,
    }).then(unwrap),
};

export const categoryApi = {
  list: () =>
    request<ApiEnvelope<Category[]>>("/categories/", {
      query: { limit: 100 },
      revalidate: CATALOG_REVALIDATE,
    }).then(unwrap),
  get: (id: number) =>
    request<ApiEnvelope<Category>>(`/categories/${id}`, { revalidate: CATALOG_REVALIDATE }).then(
      unwrap,
    ),
};

export const subCategoryApi = {
  list: () =>
    request<ApiEnvelope<SubCategory[]>>("/sub-categories/", {
      query: { limit: 100 },
      revalidate: CATALOG_REVALIDATE,
    }).then(unwrap),
};

// ---------- Orders ----------
export const orderApi = {
  list: (token: string, page = 1) =>
    request<ApiEnvelope<Order[]>>("/orders/", { token, query: { page } }).then(paged),
  get: (token: string, id: number) =>
    request<ApiEnvelope<Order>>(`/orders/${id}`, { token }).then(unwrap),
  create: (token: string, payload: CreateOrderPayload) =>
    request<ApiEnvelope<Order>>("/orders/", { method: "POST", token, body: payload }).then(unwrap),
  updateStatus: (token: string, id: number, status: OrderStatus) =>
    request<ApiEnvelope<Order>>(`/orders/${id}`, { method: "PUT", token, body: { status } }).then(
      unwrap,
    ),
};

// ---------- View-model mapper + page-level readers ----------
export function toProduct(p: ProductSummary | ProductDetail): Product {
  const detail = "images" in p ? p : null;
  const gallery = detail?.images.map((img) => imageUrl(img.url)) ?? [];
  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    price: p.price,
    stock: p.stock,
    description: detail?.description ?? "",
    image: imageUrl(p.image) || gallery[0] || "",
    images: gallery.length ? gallery : p.image ? [imageUrl(p.image)] : [],
    category: detail?.sub_category?.category?.name ?? "",
    categoryId: detail?.sub_category?.category?.id ?? null,
    subCategory: detail?.sub_category?.name ?? "",
    subCategoryId: detail?.sub_category?.id ?? null,
  };
}

export async function getProducts(query: ProductQuery = {}) {
  const { items, pagination } = await productApi.list(query);
  return { items: items.map(toProduct), pagination };
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    return toProduct(await productApi.get(id));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  const [categories, subs] = await Promise.all([categoryApi.list(), subCategoryApi.list()]);
  return categories
    .filter((c) => c.is_active)
    .map((c) => ({
      ...c,
      sub_categories: subs.filter((s) => s.category_id === c.id && s.is_active),
    }));
}

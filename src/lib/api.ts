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
    request<ApiEnvelope<Category[]>>("/categories/", { revalidate: CATALOG_REVALIDATE }).then(
      unwrap,
    ),
  get: (id: number) =>
    request<ApiEnvelope<Category>>(`/categories/${id}`, { revalidate: CATALOG_REVALIDATE }).then(
      unwrap,
    ),
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

// ---------- Temporary bridge for the existing theme (removed in Step 1) ----------
function toUiProduct(p: ProductSummary, category = "all"): Product {
  return {
    id: p.id,
    title: p.name,
    price: p.price,
    description: "",
    category,
    image: imageUrl(p.image),
    rating: { rate: 0, count: p.stock },
  };
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn("[api] request failed:", error);
    return fallback;
  }
}

export const getProducts = () =>
  safe(async () => (await productApi.list({ limit: 50 })).items.map((p) => toUiProduct(p)), []);

export const getProduct = (id: number) =>
  safe<Product | null>(async () => {
    const p = await productApi.get(id);
    return {
      ...toUiProduct(p, p.sub_category?.name ?? "all"),
      description: p.description ?? "",
    };
  }, null);

export const getCategories = () =>
  safe(async () => (await categoryApi.list()).map((c) => c.name), []);

export const getProductsByCategory = (category: string) => {
  void category;
  return getProducts();
};

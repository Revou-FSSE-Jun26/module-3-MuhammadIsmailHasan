import type {
  Address,
  ApiCart,
  ApiCartItem,
  CartItem,
  CheckoutPayload,
  AddressPayload,
  Profile,
  ProfilePayload,
  ApiEnvelope,
  Category,
  CategoryPayload,
  CreateOrderPayload,
  LoginResponse,
  Order,
  OrderStatus,
  Paginated,
  Product,
  ProductDetail,
  ProductImage,
  ProductPayload,
  ProductQuery,
  ProductSummary,
  RegisterPayload,
  SubCategory,
  SubCategoryPayload,
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
    public jwt = false,
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

function errorMessage(json: unknown, fallback: string): string {
  const body = json as {
    message?: string;
    msg?: string;
    errors?: Record<string, Record<string, string[]> | string[]>;
  } | null;
  if (body?.message) return body.message;
  if (body?.msg) return body.msg;
  const first = Object.values(body?.errors ?? {}).flatMap((group) =>
    Array.isArray(group) ? group : Object.values(group).flat(),
  )[0];
  return first ?? fallback;
}

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
    const jwt = res.status === 401 || (json !== null && typeof json === "object" && "msg" in json);
    throw new ApiError(res.status, errorMessage(json, res.statusText), jwt);
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
  changeEmail: (token: string, email: string, currentPassword: string) =>
    request<ApiEnvelope<User>>("/users/me/email", {
      method: "PUT",
      token,
      body: { email, current_password: currentPassword },
    }).then(unwrap),
  changePassword: (token: string, currentPassword: string, newPassword: string) =>
    request<ApiEnvelope<never>>("/users/me/password", {
      method: "PUT",
      token,
      body: { current_password: currentPassword, new_password: newPassword },
    }),
};

// ---------- Catalog ----------
const CATALOG_REVALIDATE = 60;

export const productApi = {
  list: (query: ProductQuery = {}) =>
    request<ApiEnvelope<ProductSummary[]>>("/products/", {
      query,
      revalidate: CATALOG_REVALIDATE,
    }).then(paged),
  get: (id: number, fresh = false) =>
    request<ApiEnvelope<ProductDetail>>(`/products/${id}`, {
      revalidate: fresh ? undefined : CATALOG_REVALIDATE,
    }).then(unwrap),
  create: (token: string, payload: ProductPayload) =>
    request<ApiEnvelope<ProductSummary>>("/products/", {
      method: "POST",
      token,
      body: payload,
    }).then(unwrap),
  update: (token: string, id: number, payload: Partial<ProductPayload>) =>
    request<ApiEnvelope<ProductSummary>>(`/products/${id}`, {
      method: "PUT",
      token,
      body: payload,
    }).then(unwrap),
  remove: (token: string, id: number) =>
    request<ApiEnvelope<never>>(`/products/${id}`, { method: "DELETE", token }),
  getBySlug: (slug: string, fresh = false) =>
    request<ApiEnvelope<ProductDetail>>(`/products/slug/${encodeURIComponent(slug)}`, {
      revalidate: fresh ? undefined : CATALOG_REVALIDATE,
    }).then(unwrap),
};

const imagesPath = (productId: number) => `/products/${productId}/images`;

export const productImageApi = {
  list: (productId: number) =>
    request<ApiEnvelope<ProductImage[]>>(`${imagesPath(productId)}/`).then(unwrap),
  addUrl: (token: string, productId: number, url: string) =>
    request<ApiEnvelope<ProductImage>>(`${imagesPath(productId)}/`, {
      method: "POST",
      token,
      body: { url },
    }).then(unwrap),
  upload: (token: string, productId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<ApiEnvelope<ProductImage>>(`${imagesPath(productId)}/upload`, {
      method: "POST",
      token,
      body: form,
    }).then(unwrap);
  },
  remove: (token: string, productId: number, imageId: number) =>
    request<ApiEnvelope<never>>(`${imagesPath(productId)}/${imageId}`, {
      method: "DELETE",
      token,
    }),
  reorder: (token: string, productId: number, imageIds: number[]) =>
    request<ApiEnvelope<ProductImage[]>>(`${imagesPath(productId)}/reorder`, {
      method: "PUT",
      token,
      body: { image_ids: imageIds },
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
  create: (token: string, payload: CategoryPayload) =>
    request<ApiEnvelope<Category>>("/categories/", { method: "POST", token, body: payload }).then(
      unwrap,
    ),
  update: (token: string, id: number, payload: CategoryPayload) =>
    request<ApiEnvelope<Category>>(`/categories/${id}`, {
      method: "PUT",
      token,
      body: payload,
    }).then(unwrap),
  remove: (token: string, id: number) =>
    request<ApiEnvelope<never>>(`/categories/${id}`, { method: "DELETE", token }),
};

export const subCategoryApi = {
  create: (token: string, payload: SubCategoryPayload) =>
    request<ApiEnvelope<SubCategory>>("/sub-categories/", {
      method: "POST",
      token,
      body: payload,
    }).then(unwrap),
  update: (token: string, id: number, payload: Partial<SubCategoryPayload>) =>
    request<ApiEnvelope<SubCategory>>(`/sub-categories/${id}`, {
      method: "PUT",
      token,
      body: payload,
    }).then(unwrap),
  remove: (token: string, id: number) =>
    request<ApiEnvelope<never>>(`/sub-categories/${id}`, { method: "DELETE", token }),
  list: () =>
    request<ApiEnvelope<SubCategory[]>>("/sub-categories/", {
      query: { limit: 100 },
      revalidate: CATALOG_REVALIDATE,
    }).then(unwrap),
};

// ---------- Addresses ----------
export const addressApi = {
  list: (token: string) => request<ApiEnvelope<Address[]>>("/addresses", { token }).then(unwrap),
  create: (token: string, payload: AddressPayload) =>
    request<ApiEnvelope<Address>>("/addresses", { method: "POST", token, body: payload }).then(
      unwrap,
    ),
  update: (token: string, id: number, payload: Partial<AddressPayload>) =>
    request<ApiEnvelope<Address>>(`/addresses/${id}`, {
      method: "PUT",
      token,
      body: payload,
    }).then(unwrap),
  remove: (token: string, id: number) =>
    request<ApiEnvelope<never>>(`/addresses/${id}`, { method: "DELETE", token }),
  setDefault: (token: string, id: number) =>
    request<ApiEnvelope<Address>>(`/addresses/${id}/default`, { method: "PUT", token }).then(
      unwrap,
    ),
};

export const profileApi = {
  get: (token: string) =>
    request<ApiEnvelope<Profile>>("/profile", { token })
      .then(unwrap)
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }),
  save: (token: string, payload: ProfilePayload) =>
    request<ApiEnvelope<Profile>>("/profile", { method: "PUT", token, body: payload }).then(unwrap),
};

// ---------- Orders ----------
export const orderApi = {
  list: (token: string, page = 1, status?: OrderStatus | "", limit?: number) =>
    request<ApiEnvelope<Order[]>>("/orders/", {
      token,
      query: { page, status: status || undefined, limit },
    }).then(paged),
  get: (token: string, id: number) =>
    request<ApiEnvelope<Order>>(`/orders/${id}`, { token }).then(unwrap),
  create: (token: string, payload: CreateOrderPayload) =>
    request<ApiEnvelope<Order>>("/orders/", { method: "POST", token, body: payload }).then(unwrap),
  updateStatus: (token: string, id: number, status: OrderStatus, trackingId?: string) =>
    request<ApiEnvelope<Order>>(`/orders/${id}`, {
      method: "PUT",
      token,
      body: { status, ...(trackingId ? { tracking_id: trackingId } : {}) },
    }).then(unwrap),
};

// ---------- Cart ----------
export const cartApi = {
  get: (token: string) => request<ApiEnvelope<ApiCart>>("/cart", { token }).then(unwrap),
  add: (token: string, productId: number, quantity = 1) =>
    request<ApiEnvelope<ApiCart>>("/cart/items", {
      method: "POST",
      token,
      body: { product_id: productId, quantity },
    }).then(unwrap),
  setQuantity: (token: string, itemId: number, quantity: number) =>
    request<ApiEnvelope<ApiCart>>(`/cart/items/${itemId}`, {
      method: "PUT",
      token,
      body: { quantity },
    }).then(unwrap),
  remove: (token: string, itemId: number) =>
    request<ApiEnvelope<ApiCart>>(`/cart/items/${itemId}`, { method: "DELETE", token }).then(
      unwrap,
    ),
  clear: (token: string) =>
    request<ApiEnvelope<ApiCart>>("/cart", { method: "DELETE", token }).then(unwrap),
  checkout: (token: string, payload: CheckoutPayload) =>
    request<ApiEnvelope<Order[]>>("/cart/checkout", {
      method: "POST",
      token,
      body: payload,
    }).then(unwrap),
};

const RESOLVABLE_IMAGE = /^(https?:)?\//;

function toCartProduct(p: ApiCartItem["product"]): Product {
  const image = p.image && RESOLVABLE_IMAGE.test(p.image) ? imageUrl(p.image) : "";
  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    price: p.price,
    stock: p.stock,
    description: "",
    image,
    images: image ? [image] : [],
    category: "",
    categoryId: null,
    subCategory: "",
    subCategoryId: null,
    seller: null,
  };
}

export function toCartItems(cart: ApiCart): CartItem[] {
  return cart.groups.flatMap((group) =>
    group.items.map((item) => ({
      product: { ...toCartProduct(item.product), price: item.unit_price },
      quantity: item.quantity,
      itemId: item.id,
      sellerId: group.seller_id,
      sellerName: group.seller_name,
      available: item.available,
      note: item.note,
      needsImage: Boolean(item.product.image) && !RESOLVABLE_IMAGE.test(item.product.image ?? ""),
    })),
  );
}

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
    categoryId: detail?.sub_category?.category?.id ?? p.sub_category?.category_id ?? null,
    subCategory: p.sub_category?.name ?? "",
    subCategoryId: p.sub_category?.id ?? null,
    seller: p.seller ?? null,
  };
}

export async function getProducts(query: ProductQuery = {}) {
  const { items, pagination } = await productApi.list(query);
  return { items: items.map(toProduct), pagination };
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    return toProduct(await productApi.getBySlug(slug));
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

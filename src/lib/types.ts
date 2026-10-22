// ---------- Backend envelope ----------
export type Pagination = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
};

export type ApiEnvelope<T> = {
  status: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
};

export type Paginated<T> = {
  items: T[];
  pagination: Pagination | null;
};

// ---------- Users / auth ----------
export type Role = "buyer" | "seller" | "admin";

export type User = {
  id: number;
  username: string;
  email: string;
  role: Role;
  last_login: string | null;
  created_at: string | null;
};

export type LoginResponse = ApiEnvelope<User> & { access_token: string; refresh_token: string };
export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  role: Exclude<Role, "admin">;
};

// ---------- Catalog ----------
export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
  order: number;
  is_active: boolean;
  created_at: string | null;
};

export type SubCategory = {
  id: number;
  name: string;
  image: string | null;
  category_id: number;
  created_at: string | null;
  is_active: boolean;
};

export type Category = {
  id: number;
  name: string;
  image: string | null;
  created_at: string | null;
  is_active: boolean;
  sub_categories?: SubCategory[];
};

/** List item from GET /products/ */
export type ProductSummary = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: string | null;
};

/** Detail from GET /products/{id} or /products/slug/{slug} */
export type ProductDetail = ProductSummary & {
  description: string | null;
  seller_id: number;
  created_at: string | null;
  is_active: boolean;
  sub_category: (SubCategory & { category: Category | null }) | null;
  images: ProductImage[];
};

export type ProductQuery = {
  name?: string;
  sub_category_id?: number;
  seller_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: "name" | "price" | "created_at";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

// ---------- Orders ----------
export type OrderStatus =
  "pending" | "paid" | "processing" | "shipped" | "delivered" | "returned" | "cancelled";

export type OrderItem = {
  id: number;
  product_id: number;
  product_name: string | null;
  unit_price: number;
  quantity: number;
  sub_total: number;
};

export type Order = {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  ordered_at: string | null;
  tracking_id: string | null;
  shipping_recipient_name: string | null;
  shipping_phone: string | null;
  shipping_address_line: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  items?: OrderItem[];
};

export type CreateOrderPayload = {
  items: { product_id: number; quantity: number }[];
  address_id?: number;
};

// ---------- UI (legacy theme shape, replaced in Step 1) ----------
export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

export type CartItem = {
  product: Product;
  quantity: number;
};

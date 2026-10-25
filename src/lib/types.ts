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
  sub_category?: { id: number; name: string; category_id: number | null } | null;
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
  sort_by?: "id" | "name" | "price" | "created_at";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

// ---------- Orders ----------
export type OrderStatus =
  | "waiting_for_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export type OrderItem = {
  id: number;
  product_id: number;
  product_name: string | null;
  unit_price: number;
  quantity: number;
  sub_total: number;
  product?: {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image: string | null;
  } | null;
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
  total_items?: number;
  total_quantity?: number;
  refund_note?: string | null;
  items?: OrderItem[];
};

export type Address = {
  id: number;
  label: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string | null;
  is_default: boolean;
};

export type AddressPayload = {
  label?: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code?: string;
  is_default?: boolean;
};

export type Profile = {
  id: number;
  user_id: number;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

export type ProfilePayload = {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

export type ProductPayload = {
  name: string;
  price: number;
  stock: number;
  description?: string;
  sub_category_id?: number;
};

export type CategoryPayload = { name: string; image?: string };
export type SubCategoryPayload = { name: string; category_id: number; image?: string };

export type CreateOrderPayload = {
  items: { product_id: number; quantity: number }[];
  address_id?: number;
};

// ---------- UI view-model (what components render; built by toProduct in api.ts) ----------
export type Product = {
  id: number;
  slug: string;
  title: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  images: string[];
  category: string;
  categoryId: number | null;
  subCategory: string;
  subCategoryId: number | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
  itemId?: number;
  sellerId?: number | null;
  sellerName?: string | null;
  available?: boolean;
  note?: string | null;
  pending?: boolean;
  needsImage?: boolean;
};

export type ApiCartItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  sub_total: number;
  available: boolean;
  note: string | null;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    is_active: boolean;
    image: string | null;
  };
};

export type ApiCartGroup = {
  seller_id: number | null;
  seller_name: string | null;
  items: ApiCartItem[];
  group_total_items: number;
  group_total_quantity: number;
  group_total: number;
};

export type ApiCart = {
  cart_id: number | null;
  groups: ApiCartGroup[];
  total_items: number;
  total_quantity: number;
  grand_total: number;
};

export type CheckoutPayload = {
  address_id?: number;
  seller_id?: number;
  cart_item_ids?: number[];
};

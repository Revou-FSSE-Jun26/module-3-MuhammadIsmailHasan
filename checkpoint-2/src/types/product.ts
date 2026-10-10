/** GET /products/ — list items omit description, category and extra images. */
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: string | null;
}

export interface Category {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  order: number;
}

/** GET /products/:id */
export interface ProductDetail extends Product {
  description: string | null;
  category: Category | null;
  images: ProductImage[];
}

export interface Pagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

/** GET /orders — list item (the detail response adds `items`). */
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  ordered_at: string;
  total_items: number;
  total_quantity: number;
  tracking_id: string | null;
  shipping_recipient_name: string | null;
  shipping_city: string | null;
}

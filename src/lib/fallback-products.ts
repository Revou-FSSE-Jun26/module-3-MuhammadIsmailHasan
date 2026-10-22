import type { Product } from "./types";

/**
 * Used only when the API can't be reached.
 * `image: ""` renders the illustrated placeholder in <ProductImage />.
 */
const base = (id: number, title: string, price: number, category: string, rate = 4.5): Product => ({
  id,
  title,
  price,
  category,
  image: "",
  description:
    "Sample product shown because the product API is unavailable. Replace it with your own catalog.",
  rating: { rate, count: 120 },
});

export const fallbackProducts: Product[] = [
  base(1, "Everyday Cotton Tee", 19.99, "men's clothing", 4.6),
  base(2, "Slim Fit Casual Shirt", 29.5, "men's clothing", 4.2),
  base(3, "Lightweight Rain Jacket", 55.99, "women's clothing", 4.4),
  base(4, "Relaxed Crew Tee", 15.99, "women's clothing", 4.1),
  base(5, "Silver Chain Bracelet", 49.0, "jewelery", 4.7),
  base(6, "Classic Gold Ring", 89.0, "jewelery", 4.3),
  base(7, "Wireless Earphones", 64.0, "electronics", 4.5),
  base(8, "Over-Ear Headphones", 119.0, "electronics", 4.8),
  base(9, "Portable SSD 1TB", 109.0, "electronics", 4.6),
  base(10, '27" IPS Monitor', 249.0, "electronics", 4.4),
];

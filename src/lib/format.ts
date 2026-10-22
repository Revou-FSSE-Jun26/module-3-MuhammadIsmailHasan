import { siteConfig } from "./site";

const priceFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electronics",
  jewelery: "Jewelry",
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
};

export function categoryLabel(category: string) {
  if (category === "all") return "All products";
  return CATEGORY_LABELS[category] ?? category.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function categoryHref(category: string) {
  return `/collections/${encodeURIComponent(category)}`;
}

export function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

import { siteConfig } from "./site";

const priceFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function categoryHref(categoryId: number | "all", subId?: number) {
  return `/collections/${categoryId}${subId ? `?sub=${subId}` : ""}`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

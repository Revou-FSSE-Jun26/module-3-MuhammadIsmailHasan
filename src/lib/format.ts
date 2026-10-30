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

const dateFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

const HAS_ZONE = /([zZ]|[+-]\d{2}:?\d{2})$/;
const HAS_TIME = /\d{2}:\d{2}/;

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const zoned = HAS_TIME.test(value) && !HAS_ZONE.test(value) ? `${value}+07:00` : value;
  return dateFormatter.format(new Date(zoned));
}

export const LOW_STOCK_LIMIT = 5;

export type StockLevel = "out" | "low" | "ok";

export function stockLevel(stock: number): StockLevel {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_LIMIT) return "low";
  return "ok";
}

export const STOCK_META: Record<
  StockLevel,
  { label: (stock: number) => string; className: string }
> = {
  out: { label: () => "Out of stock", className: "bg-coral text-white" },
  low: { label: (stock) => `Low stock · ${stock} left`, className: "bg-amber-100 text-amber-800" },
  ok: { label: (stock) => `${stock} in stock`, className: "bg-[#f2f2f2] text-muted" },
};

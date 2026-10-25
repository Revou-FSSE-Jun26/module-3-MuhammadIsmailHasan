import { cn } from "@/lib/format";
import { STOCK_META, stockLevel } from "@/lib/stock";

export function StockBadge({ stock, className }: { stock: number; className?: string }) {
  const meta = STOCK_META[stockLevel(stock)];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className,
        className,
      )}
    >
      {meta.label(stock)}
    </span>
  );
}

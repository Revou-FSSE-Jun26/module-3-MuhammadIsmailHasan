import { STATUS_META } from "@/lib/orders";
import { cn } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", meta?.className)}>
      {meta?.label ?? status}
    </span>
  );
}

import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import { imageUrl } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { orderSellers, sellerLabel } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

const MAX_THUMBS = 4;

export function OrderSummaryCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const items = order.items ?? [];
  const shown = items.slice(0, MAX_THUMBS);
  const extra = items.length - shown.length;
  const sellers = orderSellers(order);
  const label = sellerLabel(order);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group flex h-full w-full flex-col rounded-2xl border border-line bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">Order #{order.id}</p>
          <p className="mt-0.5 text-xs text-muted">{formatDate(order.ordered_at)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">
          {sellers.length > 1 ? sellers.length : label.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted">Sold by</p>
          <p className="truncate text-sm font-semibold">{label}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {shown.map((item) => (
          <div
            key={item.id}
            className="size-16 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2] sm:size-20"
          >
            <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-110">
              <ProductImage
                src={imageUrl(item.product?.image)}
                alt={item.product_name ?? "Product"}
                id={item.product_id}
                sizes="80px"
                className="p-1.5"
              />
            </div>
          </div>
        ))}
        {extra > 0 && (
          <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-[#f2f2f2] text-xs font-semibold text-muted sm:size-20">
            +{extra}
          </span>
        )}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-end justify-between gap-4 border-t border-line pt-4">
          <div>
            <p className="text-xs text-muted">{order.total_quantity ?? 0} item(s)</p>
            <p className="text-lg font-bold">{formatPrice(order.total_amount)}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted transition group-hover:text-ink">
            View details
            <Icon
              name="arrowRight"
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </button>
  );
}

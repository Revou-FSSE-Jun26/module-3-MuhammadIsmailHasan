import { ProductImage } from "@/components/product/ProductImage";
import { imageUrl } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { sellerLabel } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

const MAX_THUMBS = 4;

export function OrderSummaryCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const items = order.items ?? [];
  const shown = items.slice(0, MAX_THUMBS);
  const extra = items.length - shown.length;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group block w-full rounded-2xl border border-line bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold">Order #{order.id}</p>
          <p className="mt-0.5 text-xs text-muted">
            {formatDate(order.ordered_at)} · Sold by{" "}
            <span className="font-semibold text-ink">{sellerLabel(order)}</span>
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2">
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
            <span className="grid size-16 place-items-center rounded-xl bg-[#f2f2f2] text-xs font-semibold text-muted sm:size-20">
              +{extra}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">{order.total_quantity ?? 0} item(s)</p>
          <p className="text-lg font-bold">{formatPrice(order.total_amount)}</p>
        </div>
      </div>
    </button>
  );
}

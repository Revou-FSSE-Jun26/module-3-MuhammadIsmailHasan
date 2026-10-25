"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProductImage } from "@/components/product/ProductImage";
import { LoadingBlock } from "@/components/ui/Spinner";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { imageUrl, orderApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { itemName } from "@/lib/orders";
import type { Role } from "@/lib/types";
import { OrderStatusActions } from "./OrderStatusActions";
import { StatusBadge } from "./StatusBadge";

export function OrderDetail({ id, placed, role }: { id: number; placed: boolean; role: Role }) {
  const { state, reload } = useAuthedQuery(`order-${id}`, (token) => orderApi.get(token, id));

  if (state.status === "loading") return <LoadingBlock />;
  if (state.status === "error") {
    return (
      <p className="text-sm text-coral">
        {state.message}{" "}
        <button type="button" onClick={reload} className="font-semibold underline">
          Retry
        </button>
      </p>
    );
  }

  const order = state.data;

  return (
    <>
      {placed && (
        <p className="mb-6 rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
          Order placed! It is waiting for payment — online payment is not enabled in this demo yet.
        </p>
      )}
      <PageHeader
        title={`Order #${order.id}`}
        description={`Placed ${formatDate(order.ordered_at)}`}
        action={<StatusBadge status={order.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
          {(order.items ?? []).map((item) => (
            <li key={item.id} className="flex gap-4 p-5">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2]">
                <ProductImage
                  src={imageUrl(item.product?.image)}
                  alt={itemName(item)}
                  id={item.product_id}
                  sizes="80px"
                  className="p-2"
                />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                {item.product ? (
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="line-clamp-2 font-semibold hover:underline"
                  >
                    {itemName(item)}
                  </Link>
                ) : (
                  <p className="line-clamp-2 font-semibold">{itemName(item)}</p>
                )}
                <p className="mt-1 text-muted">
                  {item.quantity} × {formatPrice(item.unit_price)}
                </p>
              </div>
              <p className="text-sm font-bold">{formatPrice(item.sub_total)}</p>
            </li>
          ))}
        </ul>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5 text-sm">
            <h2 className="font-bold">Shipping to</h2>
            <p className="mt-2 font-semibold">{order.shipping_recipient_name}</p>
            <p className="text-muted">{order.shipping_phone}</p>
            <p className="mt-1">
              {order.shipping_address_line}, {order.shipping_city} {order.shipping_postal_code}
            </p>
            {order.tracking_id && (
              <p className="mt-3 text-xs text-muted">
                Tracking ID: <span className="font-semibold text-ink">{order.tracking_id}</span>
              </p>
            )}
          </div>
          <div className="flex justify-between rounded-2xl border border-line bg-white p-5 font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
          <OrderStatusActions order={order} role={role} onChanged={reload} />
          <Link
            href={`/dashboard/${role}/orders`}
            className="block text-center text-sm font-semibold underline underline-offset-4"
          >
            Back to orders
          </Link>
        </aside>
      </div>
    </>
  );
}

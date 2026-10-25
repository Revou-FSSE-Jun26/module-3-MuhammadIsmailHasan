"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Icon } from "@/components/ui/Icon";
import { LoadingBlock } from "@/components/ui/Spinner";
import { ProductImage } from "@/components/product/ProductImage";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { imageUrl, orderApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { itemName, sellerItems } from "@/lib/orders";
import type { Order, OrderItem, Role } from "@/lib/types";
import { OrderStatusActions } from "./OrderStatusActions";
import { StatusBadge } from "./StatusBadge";
import { StatusTimeline } from "./StatusTimeline";

type SellerGroup = { key: string; name: string; items: OrderItem[] };

function groupBySeller(order: Order): SellerGroup[] {
  const groups = new Map<string, SellerGroup>();
  for (const item of order.items ?? []) {
    const seller = item.seller ?? order.seller ?? null;
    const key = String(seller?.id ?? "unknown");
    const group = groups.get(key) ?? { key, name: seller?.name ?? "Unknown seller", items: [] };
    group.items.push(item);
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function OrderModal({
  id,
  role,
  onClose,
  onChanged,
}: {
  id: number | null;
  role: Role;
  onClose: () => void;
  onChanged: () => void;
}) {
  useEffect(() => {
    if (id === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [id, onClose]);

  return (
    <AnimatePresence>
      {id !== null && (
        <motion.div
          key="order-modal"
          className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Order #${id}`}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalBody id={id} role={role} onClose={onClose} onChanged={onChanged} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalBody({
  id,
  role,
  onClose,
  onChanged,
}: {
  id: number;
  role: Role;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { state, reload } = useAuthedQuery(`order-modal-${id}`, (token) => orderApi.get(token, id));
  const { user } = useAuth();
  const order = state.status === "ready" ? state.data : null;
  const viewerSellerId = role === "seller" ? user?.id : undefined;
  const visible = useMemo(() => {
    if (!order || viewerSellerId === undefined) return order;
    return { ...order, items: sellerItems(order, viewerSellerId) };
  }, [order, viewerSellerId]);
  const groups = useMemo(() => (visible ? groupBySeller(visible) : []), [visible]);
  const hiddenItems =
    order && visible ? (order.items?.length ?? 0) - (visible.items?.length ?? 0) : 0;
  const yourTotal = visible?.items?.reduce((n, i) => n + i.sub_total, 0) ?? 0;

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">Order #{id}</h2>
          {order && <StatusBadge status={order.status} />}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-full hover:bg-[#f3f3f3]"
          aria-label="Close order details"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="p-6">
        {state.status === "loading" && <LoadingBlock />}
        {state.status === "error" && (
          <p className="text-sm text-coral">
            {state.message}{" "}
            <button type="button" onClick={reload} className="font-semibold underline">
              Retry
            </button>
          </p>
        )}
        {order && (
          <div className="space-y-6">
            <p className="text-sm text-muted">Placed {formatDate(order.ordered_at)}</p>

            {groups.map((group) => {
              const groupTotal = group.items.reduce((n, i) => n + i.sub_total, 0);
              return (
                <section key={group.key} className="rounded-2xl border border-line">
                  <header className="flex items-center justify-between border-b border-line px-4 py-3 text-sm">
                    <p>
                      Sold by <b>{group.name}</b>
                    </p>
                    <span className="font-semibold">{formatPrice(groupTotal)}</span>
                  </header>
                  <ul className="divide-y divide-line px-4">
                    {group.items.map((item) => (
                      <li key={item.id} className="flex gap-4 py-4">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2]">
                          <ProductImage
                            src={imageUrl(item.product?.image)}
                            alt={itemName(item)}
                            id={item.product_id}
                            sizes="64px"
                            className="p-1"
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
                </section>
              );
            })}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line p-4 text-sm">
                <h3 className="font-bold">Shipping to</h3>
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
              <div className="flex items-center justify-between rounded-2xl bg-[#f6f6f6] p-4 font-bold">
                <span>{viewerSellerId !== undefined ? "Your sales" : "Total"}</span>
                <span className="text-lg">
                  {formatPrice(viewerSellerId !== undefined ? yourTotal : order.total_amount)}
                </span>
              </div>
            </div>

            {hiddenItems > 0 && (
              <p className="text-xs text-muted">
                This order also contains {hiddenItems} item(s) from other sellers. They are not
                shown here.
              </p>
            )}

            <section className="rounded-2xl border border-line p-5">
              <h3 className="mb-4 text-sm font-bold">Status history</h3>
              <StatusTimeline order={order} />
            </section>

            <OrderStatusActions
              order={order}
              role={role}
              onChanged={() => {
                reload();
                onChanged();
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import { OrderModal } from "@/components/orders/OrderModal";
import { OrderSummaryCard } from "@/components/orders/OrderSummaryCard";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { addressApi, orderApi } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { IN_PROGRESS } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { PageHeader } from "./PageHeader";
import { QueryView } from "./QueryView";

type Summary = {
  total: number;
  inProgress: number;
  delivered: number;
  spent: number;
  recent: Order[];
};

function summarize(orders: Order[], total: number): Summary {
  return {
    total,
    inProgress: orders.filter((o) => IN_PROGRESS.includes(o.status)).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    spent: orders
      .filter((o) => o.status !== "cancelled" && o.status !== "returned")
      .reduce((n, o) => n + o.total_amount, 0),
    recent: orders.slice(0, 3),
  };
}

export function BuyerOverview() {
  const { user } = useAuth();
  const { count, open } = useCart();
  const [selected, setSelected] = useState<number | null>(null);
  const orders = useAuthedQuery("buyer-overview-orders", async (token) => {
    const page = await orderApi.list(token, 1, "", 100);
    return summarize(page.items, page.pagination?.total_items ?? page.items.length);
  });
  const addresses = useAuthedQuery("buyer-overview-addresses", (token) => addressApi.list(token));
  const defaultAddress =
    addresses.state.status === "ready"
      ? (addresses.state.data.find((a) => a.is_default) ?? addresses.state.data[0] ?? null)
      : null;

  return (
    <>
      <PageHeader
        title={`Welcome back${user ? `, ${user.username}` : ""}`}
        description="Your orders, cart and account in one place."
      />

      <QueryView state={orders.state} reload={orders.reload}>
        {(summary) => (
          <>
            <dl className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Total orders" value={String(summary.total)} />
              <Stat
                label="In progress"
                value={String(summary.inProgress)}
                hint="Not delivered yet"
              />
              <Stat label="Delivered" value={String(summary.delivered)} />
              <Stat
                label="Total spent"
                value={formatPrice(summary.spent)}
                hint="Excludes cancelled"
              />
            </dl>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent orders</h2>
                  <Link
                    href="/dashboard/buyer/orders"
                    className="text-sm font-semibold underline underline-offset-4"
                  >
                    View all
                  </Link>
                </div>
                {summary.recent.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
                    You have no orders yet.{" "}
                    <Link href="/collections/all" className="font-semibold text-ink underline">
                      Start shopping
                    </Link>
                  </div>
                ) : (
                  <ul className="grid gap-4 md:grid-cols-2">
                    {summary.recent.map((order) => (
                      <li key={order.id}>
                        <OrderSummaryCard order={order} onOpen={() => setSelected(order.id)} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h2 className="font-bold">Your cart</h2>
                  <p className="mt-1 text-sm text-muted">
                    {count > 0 ? `${count} item(s) waiting for you.` : "Your cart is empty."}
                  </p>
                  <button
                    type="button"
                    onClick={open}
                    className="mt-4 h-10 w-full rounded-full bg-ink text-sm font-semibold text-white hover:bg-black"
                  >
                    Open cart
                  </button>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5 text-sm">
                  <h2 className="font-bold">Default address</h2>
                  {addresses.state.status === "loading" && (
                    <p className="mt-2 text-muted">Loading…</p>
                  )}
                  {addresses.state.status === "ready" && !defaultAddress && (
                    <p className="mt-2 text-muted">No address saved yet.</p>
                  )}
                  {defaultAddress && (
                    <>
                      <p className="mt-2 font-semibold">{defaultAddress.recipient_name}</p>
                      <p className="text-muted">{defaultAddress.phone}</p>
                      <p className="mt-1">
                        {defaultAddress.address_line}, {defaultAddress.city}{" "}
                        {defaultAddress.postal_code}
                      </p>
                    </>
                  )}
                  <Link
                    href="/dashboard/buyer/profile"
                    className="mt-3 inline-block text-xs font-semibold underline underline-offset-4"
                  >
                    Manage profile and addresses
                  </Link>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5 text-sm">
                  <h2 className="font-bold">Quick links</h2>
                  <ul className="mt-3 space-y-2 font-semibold">
                    <li>
                      <Link href="/collections/all" className="underline underline-offset-4">
                        Browse products
                      </Link>
                    </li>
                    <li>
                      <Link href="/wishlist" className="underline underline-offset-4">
                        My wishlist
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </>
        )}
      </QueryView>

      <OrderModal
        id={selected}
        role="buyer"
        onClose={() => setSelected(null)}
        onChanged={orders.reload}
      />
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-3xl font-extrabold tracking-tight">{value}</dd>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { logoutAction } from "@/app/login/actions";
import { getOrders } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { getAccessToken } from "@/lib/session";

export const metadata: Metadata = {
  title: "Orders",
  description: "Track the orders placed on your RevoShop account.",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-tint-blue text-promo-600",
  shipped: "bg-brand-100 text-brand-700",
  completed: "bg-tint-mint text-emerald-700",
  cancelled: "bg-neutral-100 text-neutral-500",
};

export default async function OrdersPage() {
  const token = await getAccessToken();

  if (!token) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Orders</h1>
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-sm font-medium text-neutral-900">Sign in to see your orders</p>
          <p className="mt-1 text-sm text-neutral-500">
            Orders are tied to your account, so we need to know who you are.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const orders = await getOrders(token);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Orders</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="h-9 rounded-full border border-neutral-200 px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-muted"
          >
            Sign out
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-sm font-medium text-neutral-900">No orders yet</p>
          <p className="mt-1 text-sm text-neutral-500">Your first order will appear here.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface p-5 shadow-card"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-900">Order #{order.id}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {new Date(order.ordered_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" · "}
                  {order.total_quantity} items
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-bold tabular-nums text-neutral-900">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

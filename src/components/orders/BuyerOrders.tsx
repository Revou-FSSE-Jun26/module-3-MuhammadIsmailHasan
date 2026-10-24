"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { orderApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export function BuyerOrders() {
  const [page, setPage] = useState(1);
  const { state, reload } = useAuthedQuery(`orders-${page}`, (token) => orderApi.list(token, page));

  return (
    <>
      <PageHeader title="My orders" description="Everything you have bought, newest first." />

      {state.status === "loading" && <div className="h-48 animate-pulse rounded-2xl bg-white" />}
      {state.status === "error" && (
        <p className="text-sm text-coral">
          {state.message}{" "}
          <button type="button" onClick={reload} className="font-semibold underline">
            Retry
          </button>
        </p>
      )}

      {state.status === "ready" && state.data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
          You have no orders yet.{" "}
          <Link href="/collections/all" className="font-semibold text-ink underline">
            Start shopping
          </Link>
        </div>
      )}

      {state.status === "ready" && state.data.items.length > 0 && (
        <>
          <ul className="space-y-3">
            {state.data.items.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/dashboard/buyer/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <p className="font-bold">Order #{order.id}</p>
                    <p className="text-xs text-muted">
                      {formatDate(order.ordered_at)} · {order.total_quantity ?? 0} item(s)
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                  <p className="font-bold">{formatPrice(order.total_amount)}</p>
                </Link>
              </li>
            ))}
          </ul>
          {state.data.pagination && state.data.pagination.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4 text-sm">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full border border-line bg-white px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-muted">
                Page {state.data.pagination.page} of {state.data.pagination.total_pages}
              </span>
              <button
                type="button"
                disabled={page >= state.data.pagination.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-line bg-white px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

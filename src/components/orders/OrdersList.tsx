"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Pager, QueryView } from "@/components/dashboard/QueryView";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { orderApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUS_META } from "@/lib/orders";
import type { OrderStatus, Role } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

const COPY: Record<Role, { title: string; text: string }> = {
  buyer: { title: "My orders", text: "Everything you have bought, newest first." },
  seller: { title: "Orders", text: "Orders that contain your products." },
  admin: { title: "Orders", text: "Every order in the store." },
};

export function OrdersList({ role }: { role: Role }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const { state, reload } = useAuthedQuery(`orders-${role}-${page}-${status}`, (token) =>
    orderApi.list(token, page, status),
  );

  return (
    <>
      <PageHeader
        title={COPY[role].title}
        description={COPY[role].text}
        action={
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as OrderStatus | "");
            }}
            aria-label="Filter by status"
            className="h-10 rounded-full border border-line bg-white px-4 text-sm font-medium outline-none focus:border-ink"
          >
            <option value="">All statuses</option>
            {(Object.keys(STATUS_META) as OrderStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        }
      />

      <QueryView state={state} reload={reload}>
        {({ items, pagination }) =>
          items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
              No orders found.{" "}
              {role === "buyer" && (
                <Link href="/collections/all" className="font-semibold text-ink underline">
                  Start shopping
                </Link>
              )}
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {items.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/dashboard/${role}/orders/${order.id}`}
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
              <Pager page={page} totalPages={pagination?.total_pages ?? 1} onChange={setPage} />
            </>
          )
        }
      </QueryView>
    </>
  );
}

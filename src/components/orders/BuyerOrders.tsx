"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Pager, QueryView } from "@/components/dashboard/QueryView";
import { Select } from "@/components/ui/Select";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { orderApi } from "@/lib/api";
import { STATUS_FILTER_OPTIONS } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";
import { OrderModal } from "./OrderModal";
import { OrderSummaryCard } from "./OrderSummaryCard";

const PAGE_SIZE = 12;

export function BuyerOrders({ placed, openId }: { placed: number; openId: number | null }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [selected, setSelected] = useState<number | null>(openId);
  const { state, reload } = useAuthedQuery(`orders-buyer-${page}-${status}`, (token) =>
    orderApi.list(token, page, status, PAGE_SIZE),
  );

  return (
    <>
      {placed > 0 && (
        <p className="mb-6 rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
          {placed > 1 ? `${placed} orders placed, one for each seller.` : "Order placed."} They are
          waiting for payment — online payment is not enabled in this demo yet.
        </p>
      )}
      <PageHeader
        title="My orders"
        description="Every seller ships and updates its own order."
        action={
          <Select
            value={status}
            onChange={(next) => {
              setPage(1);
              setStatus(next);
            }}
            options={STATUS_FILTER_OPTIONS}
            label="Filter by status"
          />
        }
      />

      <QueryView state={state} reload={reload}>
        {({ items, pagination }) =>
          items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
              No orders found.{" "}
              <Link href="/collections/all" className="font-semibold text-ink underline">
                Start shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {items.map((order) => (
                  <li key={order.id}>
                    <OrderSummaryCard order={order} onOpen={() => setSelected(order.id)} />
                  </li>
                ))}
              </ul>
              <Pager pagination={pagination} onChange={setPage} />
            </>
          )
        }
      </QueryView>

      <OrderModal id={selected} role="buyer" onClose={() => setSelected(null)} onChanged={reload} />
    </>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
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

export function StaffOrders({ role, openId }: { role: "seller" | "admin"; openId: number | null }) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [selected, setSelected] = useState<number | null>(openId);
  const { state, reload } = useAuthedQuery(`orders-${role}-${page}-${status}`, (token) =>
    orderApi.list(token, page, status, PAGE_SIZE),
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description={
          role === "seller"
            ? "Each card shows only your products. Open one to ship it and see its history."
            : "Every order in the store. Open one to update its status and see its history."
        }
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
              No orders found.
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {items.map((order) => (
                  <li key={order.id}>
                    <OrderSummaryCard
                      order={order}
                      viewerSellerId={role === "seller" ? user?.id : undefined}
                      onOpen={() => setSelected(order.id)}
                    />
                  </li>
                ))}
              </ul>
              <Pager pagination={pagination} onChange={setPage} />
            </>
          )
        }
      </QueryView>

      <OrderModal id={selected} role={role} onClose={() => setSelected(null)} onChanged={reload} />
    </>
  );
}

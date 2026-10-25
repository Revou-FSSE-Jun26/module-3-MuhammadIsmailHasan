"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { OrderModal } from "@/components/orders/OrderModal";
import { OrderSummaryCard } from "@/components/orders/OrderSummaryCard";
import { LoadingBlock } from "@/components/ui/Spinner";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { categoryApi, orderApi, productApi, toProduct } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { IN_PROGRESS, NEEDS_SHIPPING, SALE_STATUSES } from "@/lib/orders";
import { stockLevel } from "@/lib/stock";
import type { Order, Product } from "@/lib/types";
import { Panel, ProductRow, Stat } from "./OverviewParts";
import { PageHeader } from "./PageHeader";
import { QueryView } from "./QueryView";
import { StockBadge } from "./StockBadge";

type SellerSales = { id: number; name: string; revenue: number };

type Summary = {
  totalOrders: number;
  sales: number;
  inProgress: number;
  toShip: Order[];
  recent: Order[];
  products: number;
  categories: number;
  lowStock: Product[];
  outOfStock: Product[];
  top: Product[];
  sellers: SellerSales[];
};

function sellerSales(orders: Order[]): SellerSales[] {
  const totals = new Map<number, SellerSales>();
  for (const order of orders.filter((o) => SALE_STATUSES.includes(o.status))) {
    for (const item of order.items ?? []) {
      const seller = item.seller ?? order.seller;
      if (!seller) continue;
      const row = totals.get(seller.id) ?? { id: seller.id, name: seller.name, revenue: 0 };
      row.revenue += item.sub_total;
      totals.set(seller.id, row);
    }
  }
  return [...totals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
}

async function load(token: string): Promise<Summary> {
  const [orderPage, productPage, categories] = await Promise.all([
    orderApi.list(token, 1, "", 100),
    productApi.list({ sort_by: "best_selling", order: "desc", limit: 100 }, true),
    categoryApi.list(),
  ]);
  const orders = orderPage.items;
  const products = productPage.items.map(toProduct);

  return {
    totalOrders: orderPage.pagination?.total_items ?? orders.length,
    sales: orders
      .filter((o) => SALE_STATUSES.includes(o.status))
      .reduce((n, o) => n + o.total_amount, 0),
    inProgress: orders.filter((o) => IN_PROGRESS.includes(o.status)).length,
    toShip: orders
      .filter((o) => NEEDS_SHIPPING.includes(o.status))
      .sort((a, b) => (a.ordered_at ?? "").localeCompare(b.ordered_at ?? "")),
    recent: orders.slice(0, 4),
    products: productPage.pagination?.total_items ?? products.length,
    categories: categories.length,
    lowStock: products.filter((p) => stockLevel(p.stock) === "low"),
    outOfStock: products.filter((p) => stockLevel(p.stock) === "out"),
    top: products.filter((p) => p.soldCount > 0).slice(0, 5),
    sellers: sellerSales(orders),
  };
}

export function AdminOverview() {
  const { user } = useAuth();
  if (!user) return <LoadingBlock />;
  return <Overview username={user.username} />;
}

function Overview({ username }: { username: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { state, reload } = useAuthedQuery("admin-overview", load);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${username}`}
        description="The whole store: sales, orders to follow up and stock."
      />

      <QueryView state={state} reload={reload}>
        {(s) => (
          <>
            <dl className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat
                label="Total sales"
                value={formatPrice(s.sales)}
                hint="Paid orders, all sellers"
              />
              <Stat
                label="Need shipping"
                value={String(s.toShip.length)}
                hint="Paid or processing"
                tone={s.toShip.length > 0 ? "warn" : undefined}
              />
              <Stat
                label="Orders"
                value={String(s.totalOrders)}
                hint={`${s.inProgress} in progress`}
              />
              <Stat
                label="Catalogue"
                value={String(s.products)}
                hint={`${s.categories} categories`}
              />
            </dl>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="space-y-8">
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Waiting to be shipped</h2>
                    <Link
                      href="/dashboard/admin/orders"
                      className="text-sm font-semibold underline underline-offset-4"
                    >
                      All orders
                    </Link>
                  </div>
                  {s.toShip.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
                      Nothing waiting to be shipped.
                    </div>
                  ) : (
                    <ul className="grid gap-4 md:grid-cols-2">
                      {s.toShip.slice(0, 4).map((order) => (
                        <li key={order.id}>
                          <OrderSummaryCard order={order} onOpen={() => setSelected(order.id)} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.toShip.length > 4 && (
                    <p className="mt-3 text-xs text-muted">
                      +{s.toShip.length - 4} more.{" "}
                      <Link href="/dashboard/admin/orders" className="font-semibold underline">
                        See all
                      </Link>
                    </p>
                  )}
                </section>

                <section>
                  <h2 className="mb-3 text-lg font-bold">Recent orders</h2>
                  {s.recent.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
                      No orders yet.
                    </div>
                  ) : (
                    <ul className="grid gap-4 md:grid-cols-2">
                      {s.recent.map((order) => (
                        <li key={order.id}>
                          <OrderSummaryCard order={order} onOpen={() => setSelected(order.id)} />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <aside className="space-y-4">
                <Panel title="Top sellers" href="/dashboard/admin/orders" link="Orders">
                  {s.sellers.length === 0 ? (
                    <p className="text-sm text-muted">No sales yet.</p>
                  ) : (
                    <ol className="space-y-3">
                      {s.sellers.map((seller, i) => (
                        <li key={seller.id} className="flex items-center gap-3 text-sm">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-semibold">
                            {seller.name}
                          </span>
                          <span className="text-xs font-semibold">
                            {formatPrice(seller.revenue)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </Panel>

                <Panel title="Stock alerts" href="/dashboard/admin/products" link="Manage">
                  {s.outOfStock.length + s.lowStock.length === 0 ? (
                    <p className="text-sm text-muted">All products are well stocked.</p>
                  ) : (
                    <ul className="space-y-3">
                      {[...s.outOfStock, ...s.lowStock].slice(0, 6).map((p) => (
                        <ProductRow
                          key={p.id}
                          href={`/dashboard/admin/products/${p.slug}`}
                          product={p}
                          trailing={<StockBadge stock={p.stock} />}
                        />
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Best sellers" href="/dashboard/admin/products" link="All products">
                  {s.top.length === 0 ? (
                    <p className="text-sm text-muted">No sales yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {s.top.map((p) => (
                        <ProductRow
                          key={p.id}
                          href={`/dashboard/admin/products/${p.slug}`}
                          product={p}
                          trailing={
                            <span className="text-xs font-semibold">{p.soldCount} sold</span>
                          }
                        />
                      ))}
                    </ul>
                  )}
                </Panel>
              </aside>
            </div>
          </>
        )}
      </QueryView>

      <OrderModal id={selected} role="admin" onClose={() => setSelected(null)} onChanged={reload} />
    </>
  );
}

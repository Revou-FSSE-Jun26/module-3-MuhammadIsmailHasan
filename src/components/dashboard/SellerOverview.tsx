"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { OrderModal } from "@/components/orders/OrderModal";
import { OrderSummaryCard } from "@/components/orders/OrderSummaryCard";
import { ProductImage } from "@/components/product/ProductImage";
import { LoadingBlock } from "@/components/ui/Spinner";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { orderApi, productApi, toProduct } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { IN_PROGRESS, NEEDS_SHIPPING, SALE_STATUSES, sellerRevenue } from "@/lib/orders";
import { stockLevel } from "@/lib/stock";
import type { Order, Product } from "@/lib/types";
import { PageHeader } from "./PageHeader";
import { QueryView } from "./QueryView";
import { StockBadge } from "./StockBadge";

type Summary = {
  totalOrders: number;
  sales: number;
  unitsSold: number;
  inProgress: number;
  toShip: Order[];
  recent: Order[];
  products: number;
  lowStock: Product[];
  outOfStock: Product[];
  top: Product[];
};

async function load(token: string, sellerId: number): Promise<Summary> {
  const [orderPage, productPage] = await Promise.all([
    orderApi.list(token, 1, "", 100),
    productApi.list(
      { seller_id: sellerId, sort_by: "best_selling", order: "desc", limit: 100 },
      true,
    ),
  ]);
  const orders = orderPage.items;
  const products = productPage.items.map(toProduct);
  const sold = orders.filter((o) => SALE_STATUSES.includes(o.status));

  return {
    totalOrders: orderPage.pagination?.total_items ?? orders.length,
    sales: sold.reduce((n, o) => n + sellerRevenue(o, sellerId), 0),
    unitsSold: products.reduce((n, p) => n + p.soldCount, 0),
    inProgress: orders.filter((o) => IN_PROGRESS.includes(o.status)).length,
    toShip: orders
      .filter((o) => NEEDS_SHIPPING.includes(o.status))
      .sort((a, b) => (a.ordered_at ?? "").localeCompare(b.ordered_at ?? "")),
    recent: orders.slice(0, 3),
    products: productPage.pagination?.total_items ?? products.length,
    lowStock: products.filter((p) => stockLevel(p.stock) === "low"),
    outOfStock: products.filter((p) => stockLevel(p.stock) === "out"),
    top: products.filter((p) => p.soldCount > 0).slice(0, 5),
  };
}

export function SellerOverview() {
  const { user } = useAuth();
  if (!user) return <LoadingBlock />;
  return <Overview sellerId={user.id} username={user.username} />;
}

function Overview({ sellerId, username }: { sellerId: number; username: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { state, reload } = useAuthedQuery(`seller-overview-${sellerId}`, (token) =>
    load(token, sellerId),
  );

  return (
    <>
      <PageHeader
        title={`Welcome back, ${username}`}
        description="Your sales, orders to ship and stock in one place."
        action={
          <Link
            href="/dashboard/seller/products/new"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
          >
            New product
          </Link>
        }
      />

      <QueryView state={state} reload={reload}>
        {(s) => (
          <>
            <dl className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat
                label="Total sales"
                value={formatPrice(s.sales)}
                hint="Paid orders, your items"
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
                label="Units sold"
                value={String(s.unitsSold)}
                hint={`${s.products} product(s)`}
              />
            </dl>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="space-y-8">
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Ship these soon</h2>
                    <Link
                      href="/dashboard/seller/orders"
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
                          <OrderSummaryCard
                            order={order}
                            viewerSellerId={sellerId}
                            onOpen={() => setSelected(order.id)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.toShip.length > 4 && (
                    <p className="mt-3 text-xs text-muted">
                      +{s.toShip.length - 4} more.{" "}
                      <Link href="/dashboard/seller/orders" className="font-semibold underline">
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
                          <OrderSummaryCard
                            order={order}
                            viewerSellerId={sellerId}
                            onOpen={() => setSelected(order.id)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <aside className="space-y-4">
                <Panel title="Stock alerts" href="/dashboard/seller/products" link="Manage">
                  {s.outOfStock.length + s.lowStock.length === 0 ? (
                    <p className="text-sm text-muted">All products are well stocked.</p>
                  ) : (
                    <ul className="space-y-3">
                      {[...s.outOfStock, ...s.lowStock].slice(0, 6).map((p) => (
                        <ProductRow
                          key={p.id}
                          product={p}
                          trailing={<StockBadge stock={p.stock} />}
                        />
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Best sellers" href="/dashboard/seller/products" link="All products">
                  {s.top.length === 0 ? (
                    <p className="text-sm text-muted">No sales yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {s.top.map((p) => (
                        <ProductRow
                          key={p.id}
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

      <OrderModal
        id={selected}
        role="seller"
        onClose={() => setSelected(null)}
        onChanged={reload}
      />
    </>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "warn";
}) {
  return (
    <div
      className={
        tone === "warn"
          ? "rounded-2xl border border-amber-300 bg-amber-50 p-6"
          : "rounded-2xl border border-line bg-white p-6"
      }
    >
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-3xl font-extrabold tracking-tight">{value}</dd>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Panel({
  title,
  href,
  link,
  children,
}: {
  title: string;
  href: string;
  link: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <Link href={href} className="text-xs font-semibold underline underline-offset-4">
          {link}
        </Link>
      </div>
      {children}
    </div>
  );
}

function ProductRow({ product, trailing }: { product: Product; trailing: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#f2f2f2]">
        <ProductImage
          src={product.image}
          alt={product.title}
          id={product.id}
          sizes="48px"
          className="p-1"
        />
      </div>
      <Link
        href={`/dashboard/seller/products/${product.slug}`}
        className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold hover:underline"
      >
        {product.title}
      </Link>
      <div className="shrink-0">{trailing}</div>
    </li>
  );
}

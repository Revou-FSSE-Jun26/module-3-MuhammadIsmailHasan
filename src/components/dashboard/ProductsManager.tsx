"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { ApiError, productApi, toProduct } from "@/lib/api";
import { cn, formatPrice } from "@/lib/format";
import { stockLevel } from "@/lib/stock";
import type { Role } from "@/lib/types";
import { PageHeader } from "./PageHeader";
import { StockBadge } from "./StockBadge";
import { Pager, QueryView } from "./QueryView";

const SORT_CHOICES = [
  { value: "newest", label: "Newest", sort_by: "created_at", order: "desc" },
  { value: "best", label: "Best selling", sort_by: "best_selling", order: "desc" },
  { value: "price-asc", label: "Price: low to high", sort_by: "price", order: "asc" },
  { value: "price-desc", label: "Price: high to low", sort_by: "price", order: "desc" },
  { value: "name", label: "Name: A to Z", sort_by: "name", order: "asc" },
] as const;

export function ProductsManager({ role }: { role: Extract<Role, "seller" | "admin"> }) {
  const { user, authed } = useAuth();
  const toast = useToast();
  const base = `/dashboard/${role}/products`;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<string>("newest");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const sellerId = role === "seller" ? user?.id : undefined;

  const order = SORT_CHOICES.find((c) => c.value === sort) ?? SORT_CHOICES[0];

  const { state, reload } = useAuthedQuery(
    `products-${role}-${sellerId}-${page}-${query}-${sort}`,
    () =>
      productApi.list(
        {
          seller_id: sellerId,
          name: query || undefined,
          sort_by: order.sort_by,
          order: order.order,
          page,
          limit: 12,
        },
        true,
      ),
  );

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  async function onDelete(id: number) {
    try {
      await authed((token) => productApi.remove(token, id));
      setConfirmId(null);
      reload();
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not reach the server.");
      setConfirmId(null);
    }
  }

  return (
    <>
      <PageHeader
        title={role === "seller" ? "My products" : "Products"}
        description={role === "seller" ? "Products you sell." : "Every product in the store."}
        action={
          <Link
            href={`${base}/new`}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
          >
            New product
          </Link>
        }
      />

      <form onSubmit={onSearch} className="mb-6 flex flex-col gap-2 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="h-10 flex-1 rounded-full border border-line bg-white px-5 text-sm outline-none focus:border-ink"
        />
        <div className="flex gap-2">
          <Select
            value={sort}
            onChange={(next) => {
              setPage(1);
              setSort(next);
            }}
            options={SORT_CHOICES.map(({ value, label }) => ({ value, label }))}
            label="Sort products"
            className="min-w-0 flex-1 sm:flex-none"
          />
          <button
            type="submit"
            className="h-10 rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-ink"
          >
            Search
          </button>
        </div>
      </form>

      <QueryView state={state} reload={reload}>
        {({ items, pagination }) =>
          items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
              No products found.
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
                {items.map((summary) => {
                  const p = toProduct(summary);
                  const level = stockLevel(p.stock);
                  return (
                    <li
                      key={p.id}
                      className={cn(
                        "flex flex-col overflow-hidden rounded-2xl border bg-white transition hover:shadow-md",
                        level === "out" ? "border-coral/50" : "border-line",
                      )}
                    >
                      <div className="relative aspect-4/3 bg-[#f2f2f2]">
                        <ProductImage
                          src={p.image}
                          alt={p.title}
                          id={p.id}
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="p-3"
                        />
                        {level !== "ok" && (
                          <StockBadge stock={p.stock} className="absolute left-2 top-2 shadow-sm" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-3 sm:p-4">
                        <p className="line-clamp-2 min-h-10 text-sm font-semibold">{p.title}</p>
                        {role === "admin" && (
                          <p className="mt-0.5 truncate text-xs text-muted">
                            by {p.seller?.name ?? "Unknown seller"}
                          </p>
                        )}
                        <p className="mt-1 text-base font-bold">{formatPrice(p.price)}</p>
                        <p className="mt-1 text-xs text-muted">
                          {level === "ok" ? `${p.stock} in stock` : `Stock ${p.stock}`} ·{" "}
                          {p.soldCount} sold
                        </p>
                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3 text-xs font-semibold">
                          <Link
                            href={`${base}/${p.slug}`}
                            className="rounded-full border border-line px-4 py-1.5 hover:border-ink"
                          >
                            Edit
                          </Link>
                          {confirmId === p.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => onDelete(p.id)}
                                className="rounded-full bg-coral px-4 py-1.5 text-white"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmId(null)}
                                className="px-1 text-muted"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmId(p.id)}
                              className="rounded-full px-3 py-1.5 text-coral hover:bg-coral/10"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Pager pagination={pagination} onChange={setPage} />
            </>
          )
        }
      </QueryView>
    </>
  );
}

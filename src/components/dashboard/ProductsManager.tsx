"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { ApiError, productApi, toProduct } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Role } from "@/lib/types";
import { PageHeader } from "./PageHeader";
import { Pager, QueryView } from "./QueryView";

export function ProductsManager({ role }: { role: Extract<Role, "seller" | "admin"> }) {
  const { user, authed } = useAuth();
  const toast = useToast();
  const base = `/dashboard/${role}/products`;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const sellerId = role === "seller" ? user?.id : undefined;

  const { state, reload } = useAuthedQuery(`products-${role}-${sellerId}-${page}-${query}`, () =>
    productApi.list({ seller_id: sellerId, name: query || undefined, page, limit: 10 }),
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

      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="h-11 flex-1 rounded-full border border-line bg-white px-5 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          className="rounded-full border border-line bg-white px-5 text-sm font-semibold"
        >
          Search
        </button>
      </form>

      <QueryView state={state} reload={reload}>
        {({ items, pagination }) =>
          items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
              No products yet.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
                {items.map((summary) => {
                  const p = toProduct(summary);
                  return (
                    <li key={p.id} className="flex flex-wrap items-center gap-4 p-4">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2] sm:size-28">
                        <ProductImage
                          src={p.image}
                          alt={p.title}
                          id={p.id}
                          sizes="56px"
                          className="p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="line-clamp-1 font-semibold">{p.title}</p>
                        <p className="text-muted">
                          {formatPrice(p.price)} · stock {p.stock}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
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
                              className="px-2 text-muted"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmId(p.id)}
                            className="rounded-full px-4 py-1.5 text-coral hover:bg-coral/10"
                          >
                            Delete
                          </button>
                        )}
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

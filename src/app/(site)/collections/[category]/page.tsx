import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FilterChip } from "@/components/product/FilterChip";
import { ProductCard } from "@/components/product/ProductCard";
import { RevealGroup, RevealItem, SplitText } from "@/components/ui/Reveal";
import { SortSelect } from "@/components/product/SortSelect";
import { getCategories, getProducts } from "@/lib/api";
import { resolveSubCategoryIds, sortToQuery } from "@/lib/catalog";

type Params = Promise<{ category: string }>;
type Search = Promise<{ q?: string; sort?: string; sub?: string; page?: string }>;

type ResultsProps = {
  raw: string;
  q: string;
  sort: string;
  subId: number | null;
  page: number;
  subIds: number[];
  emptyCategory: boolean;
};

const PAGE_SIZE = 12;
const PER_SUB = 8;

export const metadata: Metadata = { title: "Catalog" };

const toId = (value?: string) => (value && Number.isFinite(Number(value)) ? Number(value) : null);

async function loadProducts({ q, sort, page, subIds, emptyCategory }: ResultsProps) {
  const order = sortToQuery(sort);

  if (emptyCategory) return { items: [], pagination: null, total: 0 };

  if (subIds.length > 1) {
    const rows = await Promise.all(
      subIds.map((id) => getProducts({ name: q, sub_category_id: id, limit: PER_SUB, ...order })),
    );
    return {
      items: rows
        .flatMap((r) => r.items)
        .sort((x, y) =>
          sort === "price-asc" ? x.price - y.price : sort === "price-desc" ? y.price - x.price : 0,
        ),
      pagination: null,
      total: rows.reduce((n, r) => n + (r.pagination?.total_items ?? r.items.length), 0),
    };
  }

  const result = await getProducts({
    name: q,
    sub_category_id: subIds[0],
    page,
    limit: PAGE_SIZE,
    ...order,
  });
  return { ...result, total: result.pagination?.total_items ?? result.items.length };
}

async function Results(props: ResultsProps) {
  const { raw, q, sort, subId, page } = props;
  const { items, pagination, total } = await loadProducts(props);

  const pageHref = (target: number) => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (sort !== "featured") next.set("sort", sort);
    if (subId) next.set("sub", String(subId));
    next.set("page", String(target));
    return `/collections/${raw}?${next.toString()}`;
  };

  return (
    <>
      <p className="mt-6 text-sm text-muted">{total} products</p>

      {items.length === 0 ? (
        <p className="py-24 text-center text-muted">No products found.</p>
      ) : (
        <RevealGroup
          key={`${raw}-${subId}-${q}-${sort}-${page}`}
          className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
        >
          {items.map((p, i) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} priority={i < 4} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {pagination && pagination.total_pages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-4 text-sm" aria-label="Pages">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="rounded-full border border-line px-4 py-2">
              Previous
            </Link>
          )}
          <span className="text-muted">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          {page < pagination.total_pages && (
            <Link href={pageHref(page + 1)} className="rounded-full border border-line px-4 py-2">
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="mt-6 h-5 w-28 animate-pulse rounded-full bg-[#f2f2f2]" />
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-square animate-pulse rounded-xl bg-[#f2f2f2]" />
            <div className="mt-3 h-3 w-1/3 animate-pulse rounded-full bg-[#f2f2f2]" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-[#f2f2f2]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { category: raw } = await params;
  const { q = "", sort = "featured", sub, page: rawPage } = await searchParams;
  const categoryId = toId(raw);
  const subId = toId(sub);
  const page = Math.max(1, toId(rawPage) ?? 1);

  const categories = (await getCategories()).filter((c) => c.is_active);
  const current = categories.find((c) => c.id === categoryId);
  if (raw !== "all" && !current) notFound();
  const subs = current
    ? (current.sub_categories ?? [])
    : categories.flatMap((c) => c.sub_categories ?? []);
  const subIds = resolveSubCategoryIds(categories, categoryId, subId);
  const emptyCategory = current !== undefined && subIds.length === 0;
  const title = q ? `Results for “${q}”` : (current?.name ?? "All products");

  const chipHref = (categoryTarget: number | "all", subTarget?: number) => {
    const next = new URLSearchParams();
    if (subTarget) next.set("sub", String(subTarget));
    if (q) next.set("q", q);
    if (sort !== "featured") next.set("sort", sort);
    const query = next.toString();
    return `/collections/${categoryTarget}${query ? `?${query}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / <span className="text-ink">{title}</span>
      </nav>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
        <SplitText text={title} animateOnMount />
      </h1>

      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto">
          <li>
            <FilterChip href={chipHref(current?.id ?? "all")} active={!subId}>
              All
            </FilterChip>
          </li>
          {subs.map((s) => (
            <li key={s.id}>
              <FilterChip href={chipHref(s.category_id, s.id)} active={subId === s.id}>
                {s.name}
              </FilterChip>
            </li>
          ))}
        </ul>
        <SortSelect value={sort} />
      </div>

      <Suspense key={`${raw}-${subId}-${q}-${sort}-${page}`} fallback={<ResultsSkeleton />}>
        <Results
          raw={raw}
          q={q}
          sort={sort}
          subId={subId}
          page={page}
          subIds={subIds}
          emptyCategory={emptyCategory}
        />
      </Suspense>
    </div>
  );
}

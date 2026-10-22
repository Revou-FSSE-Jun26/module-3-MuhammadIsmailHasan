import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { RevealGroup, RevealItem, SplitText } from "@/components/ui/Reveal";
import { SortSelect } from "@/components/product/SortSelect";
import { getCategories, getProductsByCategory } from "@/lib/api";
import { categoryHref, categoryLabel, cn, safeDecode } from "@/lib/format";

type Params = Promise<{ category: string }>;
type Search = Promise<{ q?: string; sort?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  return { title: categoryLabel(safeDecode(category)) };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { category: raw } = await params;
  const { q = "", sort = "featured" } = await searchParams;
  const category = safeDecode(raw);

  const [all, categories] = await Promise.all([getProductsByCategory(category), getCategories()]);

  let products = q
    ? all.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(q.toLowerCase()))
    : all;

  products = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating.rate - a.rating.rate;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / <span className="text-ink">{categoryLabel(category)}</span>
      </nav>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
        <SplitText text={q ? `Results for “${q}”` : categoryLabel(category)} animateOnMount />
      </h1>

      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto">
          {["all", ...categories].map((c) => (
            <li key={c}>
              <Link
                href={categoryHref(c)}
                className={cn(
                  "block whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
                  c === category ? "border-ink bg-ink text-white" : "border-line hover:border-ink",
                )}
              >
                {categoryLabel(c)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{products.length} products</span>
          <SortSelect value={sort} query={q} />
        </div>
      </div>

      {products.length === 0 ? (
        <p className="py-24 text-center text-muted">No products found.</p>
      ) : (
        <RevealGroup
          key={`${category}-${q}-${sort}`}
          className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
        >
          {products.map((p, i) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} priority={i < 4} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}

import type { ReactNode } from "react";
import { LoadingBlock } from "@/components/ui/Spinner";
import type { QueryState } from "@/hooks/useAuthedQuery";
import type { Pagination } from "@/lib/types";

export function QueryView<T>({
  state,
  reload,
  children,
}: {
  state: QueryState<T>;
  reload: () => void;
  children: (data: T) => ReactNode;
}) {
  if (state.status === "loading") {
    return <LoadingBlock />;
  }
  if (state.status === "error") {
    return (
      <p className="rounded-2xl bg-coral/10 px-5 py-4 text-sm text-coral">
        {state.message}{" "}
        <button type="button" onClick={reload} className="font-semibold underline">
          Retry
        </button>
      </p>
    );
  }
  return <>{children(state.data)}</>;
}

function pageList(page: number, total: number): (number | "gap")[] {
  const wanted = new Set([1, total, page - 1, page, page + 1]);
  const pages = [...wanted].filter((n) => n >= 1 && n <= total).sort((x, y) => x - y);
  const result: (number | "gap")[] = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) result.push("gap");
    result.push(n);
  });
  return result;
}

export function Pager({
  pagination,
  onChange,
}: {
  pagination: Pagination | null | undefined;
  onChange: (page: number) => void;
}) {
  if (!pagination) return null;
  const { page, limit, total_items: total, total_pages: totalPages } = pagination;
  if (total === 0) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
      <p className="text-muted">
        Showing <b className="text-ink">{from}</b>–<b className="text-ink">{to}</b> of{" "}
        <b className="text-ink">{total}</b>
      </p>
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className="grid h-10 place-items-center rounded-full border border-line bg-white px-3 font-medium sm:px-4 transition hover:border-ink disabled:opacity-40 disabled:hover:border-line"
          >
            Previous
          </button>
          {pageList(page, totalPages).map((item, i) =>
            item === "gap" ? (
              <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={
                  item === page
                    ? "grid size-10 place-items-center rounded-full bg-ink font-semibold text-white"
                    : "grid size-10 place-items-center rounded-full border border-line bg-white font-medium transition hover:border-ink"
                }
              >
                {item}
              </button>
            ),
          )}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            className="grid h-10 place-items-center rounded-full border border-line bg-white px-3 font-medium sm:px-4 transition hover:border-ink disabled:opacity-40 disabled:hover:border-line"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

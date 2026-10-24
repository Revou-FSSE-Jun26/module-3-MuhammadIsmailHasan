import type { ReactNode } from "react";
import { LoadingBlock } from "@/components/ui/Spinner";
import type { QueryState } from "@/hooks/useAuthedQuery";

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

export function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-sm">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-full border border-line bg-white px-4 py-2 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-full border border-line bg-white px-4 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

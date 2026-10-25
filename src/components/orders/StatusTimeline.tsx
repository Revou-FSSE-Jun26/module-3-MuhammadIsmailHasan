import { formatDate } from "@/lib/format";
import { STATUS_META } from "@/lib/orders";
import type { Order, StatusHistoryEntry } from "@/lib/types";

function entries(order: Order): StatusHistoryEntry[] {
  const history = order.status_history ?? [];
  if (history.length > 0) return history;
  return [
    {
      id: 0,
      from_status: null,
      to_status: "waiting_for_payment",
      tracking_id: null,
      created_at: order.ordered_at,
      changed_by: null,
    },
  ];
}

export function StatusTimeline({ order }: { order: Order }) {
  const list = entries(order);

  return (
    <ol className="relative space-y-5 border-l border-line pl-6">
      {list.map((entry, index) => {
        const latest = index === list.length - 1;
        const meta = STATUS_META[entry.to_status];
        return (
          <li key={entry.id || `first-${index}`} className="relative">
            <span
              className={
                latest
                  ? "absolute -left-[31px] top-1 size-3 rounded-full bg-ink ring-4 ring-ink/10"
                  : "absolute -left-[31px] top-1 size-3 rounded-full bg-line"
              }
            />
            <p className={latest ? "text-sm font-bold" : "text-sm font-semibold text-muted"}>
              {entry.from_status === null ? "Order placed" : (meta?.label ?? entry.to_status)}
            </p>
            <p className="text-xs text-muted">
              {formatDate(entry.created_at)}
              {entry.changed_by && ` · by ${entry.changed_by.name} (${entry.changed_by.role})`}
            </p>
            {entry.tracking_id && (
              <p className="mt-0.5 text-xs text-muted">
                Tracking ID: <span className="font-semibold text-ink">{entry.tracking_id}</span>
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

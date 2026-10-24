"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError, orderApi } from "@/lib/api";
import { ACTION_LABEL, nextStatuses } from "@/lib/orders";
import type { Order, OrderStatus, Role } from "@/lib/types";

export function OrderStatusActions({
  order,
  role,
  onChanged,
}: {
  order: Order;
  role: Role;
  onChanged: () => void;
}) {
  const { authed } = useAuth();
  const toast = useToast();
  const [shipping, setShipping] = useState(false);
  const [tracking, setTracking] = useState("");
  const [busy, setBusy] = useState(false);
  const options = nextStatuses(role, order.status);

  if (options.length === 0) return null;

  async function change(status: OrderStatus, trackingId?: string) {
    setBusy(true);
    try {
      await authed((token) => orderApi.updateStatus(token, order.id, status, trackingId));
      setShipping(false);
      setTracking("");
      onChanged();
      toast.success(`Order marked as ${status.replace(/_/g, " ")}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5 text-sm">
      <h2 className="font-bold">Update status</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((status) => (
          <button
            key={status}
            type="button"
            disabled={busy}
            onClick={() => (status === "shipped" ? setShipping(true) : change(status))}
            className={
              status === "cancelled" || status === "returned"
                ? "rounded-full border border-coral px-4 py-2 text-xs font-semibold text-coral hover:bg-coral/10 disabled:opacity-50"
                : "rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-50"
            }
          >
            {ACTION_LABEL[status]}
          </button>
        ))}
      </div>
      {shipping && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tracking.trim()) change("shipped", tracking.trim());
          }}
          className="mt-3 flex gap-2"
        >
          <input
            autoFocus
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="Tracking ID"
            className="h-10 flex-1 rounded-full border border-line px-4 text-sm outline-none focus:border-ink"
          />
          <button
            type="submit"
            disabled={busy || !tracking.trim()}
            className="rounded-full bg-ink px-4 text-xs font-semibold text-white disabled:opacity-50"
          >
            Ship
          </button>
        </form>
      )}
    </div>
  );
}

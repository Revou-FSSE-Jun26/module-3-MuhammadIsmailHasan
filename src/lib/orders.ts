import type { OrderStatus, Role } from "./types";

export const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  waiting_for_payment: { label: "Waiting for payment", className: "bg-amber-100 text-amber-800" },
  paid: { label: "Paid", className: "bg-sky-100 text-sky-800" },
  processing: { label: "Processing", className: "bg-indigo-100 text-indigo-800" },
  shipped: { label: "Shipped", className: "bg-violet-100 text-violet-800" },
  delivered: { label: "Delivered", className: "bg-emerald-100 text-emerald-800" },
  returned: { label: "Returned", className: "bg-orange-100 text-orange-800" },
  cancelled: { label: "Cancelled", className: "bg-neutral-200 text-neutral-700" },
};

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  waiting_for_payment: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["returned"],
  returned: [],
  cancelled: [],
};

const ROLE_TARGETS: Record<Role, OrderStatus[]> = {
  buyer: ["returned", "cancelled"],
  seller: ["paid", "processing", "shipped", "delivered", "cancelled"],
  admin: ["paid", "processing", "shipped", "delivered", "returned", "cancelled"],
};

export const ACTION_LABEL: Record<OrderStatus, string> = {
  waiting_for_payment: "Waiting for payment",
  paid: "Mark as paid",
  processing: "Start processing",
  shipped: "Mark as shipped",
  delivered: "Mark as delivered",
  returned: "Mark as returned",
  cancelled: "Cancel order",
};

export function nextStatuses(role: Role, status: OrderStatus): OrderStatus[] {
  return TRANSITIONS[status].filter((next) => ROLE_TARGETS[role].includes(next));
}

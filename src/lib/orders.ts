import type { Order, OrderStatus, Role, Seller } from "./types";

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

export const IN_PROGRESS: OrderStatus[] = ["waiting_for_payment", "paid", "processing", "shipped"];

export function orderSellers(order: Order): Seller[] {
  const found = new Map<number, Seller>();
  for (const item of order.items ?? []) {
    if (item.seller) found.set(item.seller.id, item.seller);
  }
  if (found.size === 0 && order.seller) found.set(order.seller.id, order.seller);
  return [...found.values()];
}

export function sellerLabel(order: Order): string {
  const sellers = orderSellers(order);
  if (sellers.length === 0) return "Unknown seller";
  if (sellers.length === 1) return sellers[0].name;
  return `${sellers.length} sellers`;
}

export const STATUS_FILTER_OPTIONS: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  ...(Object.keys(STATUS_META) as OrderStatus[]).map((s) => ({
    value: s,
    label: STATUS_META[s].label,
  })),
];

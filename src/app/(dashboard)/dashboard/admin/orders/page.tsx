import type { Metadata } from "next";
import { StaffOrders } from "@/components/orders/StaffOrders";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const open = Number((await searchParams).order);
  return <StaffOrders role="admin" openId={Number.isInteger(open) && open > 0 ? open : null} />;
}

import type { Metadata } from "next";
import { SellerOrders } from "@/components/orders/SellerOrders";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const open = Number((await searchParams).order);
  return <SellerOrders openId={Number.isInteger(open) && open > 0 ? open : null} />;
}

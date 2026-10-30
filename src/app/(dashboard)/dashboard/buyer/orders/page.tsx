import type { Metadata } from "next";
import { BuyerOrders } from "@/components/orders/BuyerOrders";

export const metadata: Metadata = { title: "My orders" };

export default async function BuyerOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ placed?: string; order?: string; pay?: string }>;
}) {
  const { placed, order, pay } = await searchParams;
  const placedCount = Number(placed);
  const orderId = Number(order);
  return (
    <BuyerOrders
      placed={Number.isInteger(placedCount) && placedCount > 0 ? placedCount : 0}
      openId={Number.isInteger(orderId) && orderId > 0 ? orderId : null}
      autoPay={pay === "1"}
    />
  );
}

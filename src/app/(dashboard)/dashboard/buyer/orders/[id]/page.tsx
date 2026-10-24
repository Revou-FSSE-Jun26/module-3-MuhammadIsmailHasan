import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/orders/OrderDetail";

export const metadata: Metadata = { title: "Order" };

export default async function BuyerOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { id } = await params;
  const { placed } = await searchParams;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();
  return <OrderDetail id={orderId} placed={placed === "1"} role="buyer" />;
}

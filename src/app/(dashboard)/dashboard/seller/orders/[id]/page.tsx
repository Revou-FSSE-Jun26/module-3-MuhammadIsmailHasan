import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/orders/OrderDetail";

export const metadata: Metadata = { title: "Order" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const orderId = Number((await params).id);
  if (!Number.isInteger(orderId)) notFound();
  return <OrderDetail id={orderId} placed={false} role="seller" />;
}

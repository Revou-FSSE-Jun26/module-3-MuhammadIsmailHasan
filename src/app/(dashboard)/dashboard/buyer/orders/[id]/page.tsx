import { notFound, redirect } from "next/navigation";

export default async function BuyerOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();
  redirect(`/dashboard/buyer/orders?order=${orderId}`);
}

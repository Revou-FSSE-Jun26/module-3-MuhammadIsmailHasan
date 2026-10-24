import type { Metadata } from "next";
import { OrdersList } from "@/components/orders/OrdersList";

export const metadata: Metadata = { title: "My orders" };

export default function BuyerOrdersPage() {
  return <OrdersList role="buyer" />;
}

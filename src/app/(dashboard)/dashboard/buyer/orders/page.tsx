import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "My orders" };

export default function Page() {
  return <ComingSoon title="My orders" step="Step 5" />;
}

import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Orders" };

export default function Page() {
  return <ComingSoon title="Orders" step="Step 4" />;
}

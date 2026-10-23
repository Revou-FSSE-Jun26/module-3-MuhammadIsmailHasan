import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Products" };

export default function Page() {
  return <ComingSoon title="Products" step="Step 4" />;
}

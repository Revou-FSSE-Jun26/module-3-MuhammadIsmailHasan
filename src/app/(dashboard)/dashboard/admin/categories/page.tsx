import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Categories" };

export default function Page() {
  return <ComingSoon title="Categories" step="Step 4" />;
}

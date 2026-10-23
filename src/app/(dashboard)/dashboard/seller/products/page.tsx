import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "My products" };

export default function Page() {
  return <ComingSoon title="My products" step="Step 4" />;
}

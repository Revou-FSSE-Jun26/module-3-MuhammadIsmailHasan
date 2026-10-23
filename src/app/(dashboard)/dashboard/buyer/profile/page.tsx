import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = { title: "Profile" };

export default function Page() {
  return <ComingSoon title="Profile" step="Step 5" />;
}

import { RequireRole } from "@/components/auth/RequireRole";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole allow={["buyer"]}>{children}</RequireRole>;
}

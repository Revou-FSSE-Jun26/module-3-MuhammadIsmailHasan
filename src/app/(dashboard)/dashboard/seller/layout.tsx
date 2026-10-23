import { RequireRole } from "@/components/auth/RequireRole";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole allow={["seller"]}>{children}</RequireRole>;
}

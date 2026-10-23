import { RequireRole } from "@/components/auth/RequireRole";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

export default function DashboardIndex() {
  return (
    <RequireRole allow={["buyer", "seller", "admin"]}>
      <RoleRedirect />
    </RequireRole>
  );
}

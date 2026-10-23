import type { Role } from "./types";

export type DashboardLink = { label: string; href: string; text: string };

export const DASHBOARD_NAV: Record<Role, DashboardLink[]> = {
  admin: [
    { label: "Overview", href: "/dashboard/admin", text: "Store at a glance" },
    { label: "Products", href: "/dashboard/admin/products", text: "Manage every product" },
    {
      label: "Categories",
      href: "/dashboard/admin/categories",
      text: "Categories and sub-categories",
    },
    { label: "Orders", href: "/dashboard/admin/orders", text: "All orders, update status" },
  ],
  seller: [
    { label: "Overview", href: "/dashboard/seller", text: "Your shop at a glance" },
    {
      label: "My products",
      href: "/dashboard/seller/products",
      text: "Add and edit your products",
    },
    { label: "Orders", href: "/dashboard/seller/orders", text: "Orders containing your products" },
  ],
  buyer: [
    { label: "Overview", href: "/dashboard/buyer", text: "Your account at a glance" },
    { label: "My orders", href: "/dashboard/buyer/orders", text: "Track your purchases" },
    { label: "Profile", href: "/dashboard/buyer/profile", text: "Your details and addresses" },
  ],
};

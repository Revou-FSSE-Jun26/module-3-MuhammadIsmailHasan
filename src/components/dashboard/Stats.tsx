"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { categoryApi, orderApi, productApi } from "@/lib/api";
import type { Role } from "@/lib/types";

type Stat = { label: string; value: number };

export function Stats({ role }: { role: Role }) {
  const { user } = useAuth();
  const { state } = useAuthedQuery(`stats-${role}`, async (token): Promise<Stat[]> => {
    const orders = (await orderApi.list(token, 1)).pagination?.total_items ?? 0;
    if (role === "buyer") return [{ label: "Orders", value: orders }];
    const products =
      (await productApi.list({ limit: 1, seller_id: role === "seller" ? user?.id : undefined }))
        .pagination?.total_items ?? 0;
    if (role === "seller") {
      return [
        { label: "My products", value: products },
        { label: "Orders", value: orders },
      ];
    }
    const categories = (await categoryApi.list()).length;
    return [
      { label: "Products", value: products },
      { label: "Categories", value: categories },
      { label: "Orders", value: orders },
    ];
  });

  if (state.status !== "ready") {
    return <div className="mb-8 h-24 animate-pulse rounded-2xl bg-white" />;
  }

  return (
    <dl className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {state.data.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-line bg-white p-6">
          <dt className="text-sm text-muted">{stat.label}</dt>
          <dd className="mt-1 text-3xl font-extrabold tracking-tight">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

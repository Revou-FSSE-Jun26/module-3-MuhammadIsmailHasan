"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { SORT_OPTIONS } from "@/lib/catalog";

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onChange(next: string) {
    const query = new URLSearchParams(params.toString());
    query.set("sort", next);
    query.delete("page");
    router.push(`${pathname}?${query.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted">Sort by</span>
      <Select
        value={value}
        onChange={onChange}
        options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        label="Sort by"
      />
    </div>
  );
}

"use client";

import Link, { useLinkStatus } from "next/link";
import type { ReactNode } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/format";

function Pending() {
  const { pending } = useLinkStatus();
  return pending ? <Spinner className="ml-2 size-3.5 align-[-2px]" /> : null;
}

export function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
        active ? "border-ink bg-ink text-white" : "border-line hover:border-ink",
      )}
    >
      {children}
      <Pending />
    </Link>
  );
}

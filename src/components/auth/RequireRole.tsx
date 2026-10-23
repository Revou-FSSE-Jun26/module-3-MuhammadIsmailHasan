"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROLE_HOME, guardState } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { useAuth } from "./AuthProvider";

export function RequireRole({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const state = guardState(status, user, allow);

  useEffect(() => {
    if (state === "login") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [state, router, pathname]);

  if (state === "ok") return <>{children}</>;

  if (state === "forbidden") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <p className="text-7xl font-extrabold text-outline">403</p>
        <h1 className="mt-4 text-2xl font-bold">You don&apos;t have access</h1>
        <p className="mt-2 text-muted">This page is not available for your account role.</p>
        <Link
          href={user ? ROLE_HOME[user.role] : "/"}
          className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          Go to my dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-busy="true">
      <div className="h-10 w-64 animate-pulse rounded-full bg-[#f2f2f2]" />
    </div>
  );
}

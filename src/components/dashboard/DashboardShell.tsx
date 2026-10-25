"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/format";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";
import { ROLE_HOME } from "@/lib/auth";
import { siteConfig } from "@/lib/site";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const nav = user ? DASHBOARD_NAV[user.role] : [];

  const home = user ? ROLE_HOME[user.role] : null;
  const isActive = (href: string) =>
    pathname === href || (href !== home && pathname.startsWith(`${href}/`));

  function onLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#f6f6f7] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-white p-5 lg:flex">
        <Link href={user ? ROLE_HOME[user.role] : "/"} className="text-xl font-extrabold">
          {siteConfig.name}
        </Link>
        {user && (
          <span className="mt-3 w-fit rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            {user.role}
          </span>
        )}
        <nav className="mt-8 flex-1" aria-label="Dashboard">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                    isActive(item.href)
                      ? "bg-ink text-white"
                      : "text-muted hover:bg-[#f2f2f2] hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-1 border-t border-line pt-4 text-sm font-semibold">
          <Link
            href="/"
            className="block rounded-xl px-4 py-2.5 text-muted hover:bg-[#f2f2f2] hover:text-ink"
          >
            View store
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="block w-full rounded-xl px-4 py-2.5 text-left text-coral hover:bg-coral/10"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="min-w-0 overflow-x-clip">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/85 px-4 backdrop-blur sm:px-8">
          <Link href="/" className="text-lg font-extrabold lg:hidden">
            {siteConfig.name}
          </Link>
          <p className="hidden text-sm text-muted lg:block">Dashboard</p>
          <div className="flex min-w-0 items-center gap-3">
            {user && (
              <div className="min-w-0 text-right text-xs leading-tight">
                <p className="max-w-32 truncate font-semibold sm:max-w-none">{user.username}</p>
                <p className="hidden text-muted sm:block">{user.email}</p>
              </div>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold lg:hidden"
            >
              Logout
            </button>
          </div>
        </header>

        <nav
          className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 lg:hidden"
          aria-label="Dashboard"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold",
                isActive(item.href) ? "bg-ink text-white" : "bg-white text-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

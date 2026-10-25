"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api";
import { ROLE_HOME, safeNext } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { useAuth } from "./AuthProvider";
import { AuthShell, Field, FormError, buttonClass } from "./AuthShell";

const DEMO_PASSWORD = "password123";

const DEMO_ACCOUNTS: { role: Role; email: string }[] = [
  { role: "buyer", email: "jane@example.com" },
  { role: "seller", email: "alice@example.com" },
  { role: "admin", email: "john@example.com" },
];

function DemoAccounts({ onPick }: { onPick: (email: string, password: string) => void }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-ink shadow-sm ring-1 ring-black/5">
      <p className="text-sm font-bold">Try a demo account</p>
      <p className="mt-1 text-xs text-muted">
        Pick a role to fill the form. Password: <b className="text-ink">{DEMO_PASSWORD}</b>
      </p>
      <ul className="mt-4 space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <li key={account.role}>
            <button
              type="button"
              onClick={() => onPick(account.email, DEMO_PASSWORD)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-4 py-2.5 text-left transition hover:border-ink hover:shadow-sm"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold capitalize">{account.role}</span>
                <span className="block truncate text-xs text-muted">{account.email}</span>
              </span>
              <span className="shrink-0 text-xs font-semibold underline underline-offset-4">
                Use
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LoginForm() {
  const { user, login } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user && !pending) router.replace(next ?? ROLE_HOME[user.role]);
  }, [user, pending, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const signedIn = await login(email.trim(), password);
      router.replace(next ?? ROLE_HOME[signedIn.role]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
      setPending(false);
    }
  }

  function fill(nextEmail: string, nextPassword: string) {
    setEmail(nextEmail);
    setPassword(nextPassword);
    setError(null);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders, manage your shop and check out faster."
      aside={{
        eyebrow: "RevoShop",
        title: "Everything you need, one account.",
      }}
      asideExtra={<DemoAccounts onPick={fill} />}
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
        <FormError message={error} />
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
          {pending ? "Signing in…" : "Sign in"}
        </button>
        {pending && (
          <p className="text-center text-xs text-muted">
            The first request can take up to a minute while the server wakes up.
          </p>
        )}
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-ink underline underline-offset-4">
          Create one
        </Link>
      </p>
      <div className="mt-8 lg:hidden">
        <DemoAccounts onPick={fill} />
      </div>
    </AuthShell>
  );
}

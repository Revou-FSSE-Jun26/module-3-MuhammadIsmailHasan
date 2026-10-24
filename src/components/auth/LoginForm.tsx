"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api";
import { ROLE_HOME, safeNext } from "@/lib/auth";
import { useAuth } from "./AuthProvider";
import { AuthShell, Field, FormError, buttonClass } from "./AuthShell";

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

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders, manage your shop and check out faster."
      aside={{
        eyebrow: "RevoShop",
        title: "Everything you need, one account.",
        points: ["Track every order in one place", "Faster checkout", "Sell your own products"],
        scene: "hills",
        palette: "peach",
      }}
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
    </AuthShell>
  );
}

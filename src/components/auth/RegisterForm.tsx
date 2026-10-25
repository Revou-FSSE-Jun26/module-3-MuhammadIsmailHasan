"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api";
import { ROLE_HOME, validateRegister } from "@/lib/auth";
import { cn } from "@/lib/format";
import { useAuth } from "./AuthProvider";
import { AuthShell, Field, FormError, buttonClass } from "./AuthShell";

const ROLES = [
  { value: "buyer", title: "Buyer", text: "Shop and track your orders" },
  { value: "seller", title: "Seller", text: "List products and manage orders" },
] as const;

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState({ username: "", email: "", password: "", confirm: "" });
  const [role, setRole] = useState<(typeof ROLES)[number]["value"]>("buyer");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof values) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const invalid = validateRegister(values);
    if (invalid) return setError(invalid);
    setError(null);
    setPending(true);
    try {
      const user = await register({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
        role,
      });
      router.replace(ROLE_HOME[user.role]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
      setPending(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes less than a minute. Pick how you want to use RevoShop."
      aside={{
        eyebrow: "Join RevoShop",
        title: "Shop smarter. Sell with ease.",
        points: ["Free to join", "Buyer and seller tools", "Orders and stock in one dashboard"],
      }}
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold">I want to</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <label
                key={r.value}
                className={cn(
                  "cursor-pointer rounded-2xl border p-4 transition",
                  role === r.value
                    ? "border-ink bg-ink text-white shadow-lg"
                    : "border-line hover:border-ink",
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={role === r.value}
                  onChange={() => setRole(r.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-bold">{r.title}</span>
                <span
                  className={cn(
                    "mt-1 block text-xs",
                    role === r.value ? "text-white/75" : "text-muted",
                  )}
                >
                  {r.text}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label="Username"
          value={values.username}
          onChange={set("username")}
          placeholder="yourname"
          autoComplete="username"
        />
        <Field
          label="Email"
          type="email"
          value={values.email}
          onChange={set("email")}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Password"
            type="password"
            value={values.password}
            onChange={set("password")}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
          />
          <Field
            label="Confirm"
            type="password"
            value={values.confirm}
            onChange={set("confirm")}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
        </div>
        <FormError message={error} />
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

"use client";

import { useActionState, useState } from "react";

import { loginAction, type LoginFormState } from "@/app/login/actions";

const INITIAL_STATE: LoginFormState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);

  const [edited, setEdited] = useState(false);
  const hideMessages = edited || isPending;
  const emailError = hideMessages ? undefined : state.error?.email;
  const passwordError = hideMessages ? undefined : state.error?.password;
  const message = hideMessages ? undefined : state.message;

  return (
    <form
      action={formAction}
      onSubmit={() => setEdited(false)}
      className="rounded-2xl bg-surface p-8 shadow-card"
    >
      <h1 className="text-xl font-bold tracking-tight text-neutral-900">Sign in</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Your orders are tied to your RevoShop account.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            onChange={() => setEdited(true)}
            className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-surface px-3.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {emailError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={() => setEdited(true)}
            className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-surface px-3.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {passwordError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {passwordError}
            </p>
          )}
        </div>

        {message && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {message}
            </p>
          )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 h-11 w-full rounded-full bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:bg-neutral-300"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormError, buttonClass } from "@/components/auth/AuthShell";
import { AddressForm } from "@/components/checkout/AddressForm";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { ApiError, addressApi, authApi, profileApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PHONE_HINT, isValidPhone, sanitizePhone } from "@/lib/validation";
import type { Address, Profile } from "@/lib/types";
import { validateNewPassword } from "@/lib/auth";
import { QueryView } from "./QueryView";

function AccountCard() {
  const { user } = useAuth();
  if (!user) return null;
  const initial = user.username.slice(0, 1).toUpperCase();
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-ink text-2xl font-bold text-white">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{user.username}</p>
          <p className="truncate text-sm text-muted">{user.email}</p>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
        <div>
          <dt className="text-muted">Role</dt>
          <dd className="mt-0.5 font-semibold capitalize">{user.role}</dd>
        </div>
        <div>
          <dt className="text-muted">Member since</dt>
          <dd className="mt-0.5 font-semibold">
            {user.created_at ? formatDate(user.created_at) : "-"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function ProfileForm({ profile, onSaved }: { profile: Profile | null; onSaved: () => void }) {
  const { authed } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    avatar_url: profile?.avatar_url ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof values) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({
      ...v,
      [key]: key === "phone" ? sanitizePhone(e.target.value) : e.target.value,
    }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (values.phone.trim() && !isValidPhone(values.phone.trim())) return setError(PHONE_HINT);
    setError(null);
    setPending(true);
    try {
      await authed((token) =>
        profileApi.save(token, {
          full_name: values.full_name.trim() || null,
          phone: values.phone.trim() || null,
          avatar_url: values.avatar_url.trim() || null,
        }),
      );
      toast.success("Profile saved");
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-line bg-white p-6"
      noValidate
    >
      <h2 className="text-lg font-bold">Personal details</h2>
      <Field
        label="Full name"
        value={values.full_name}
        onChange={set("full_name")}
        autoComplete="name"
        maxLength={150}
      />
      <Field
        label="Phone"
        value={values.phone}
        onChange={set("phone")}
        autoComplete="tel"
        inputMode="tel"
        maxLength={30}
      />
      <Field
        label="Avatar URL (optional)"
        value={values.avatar_url}
        onChange={set("avatar_url")}
        maxLength={255}
        placeholder="https://"
      />
      <FormError message={error} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function EmailForm() {
  const { user, authed, updateUser } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(next))
      return setError("Enter a valid email address.");
    if (next === user?.email) return setError("That is already your email.");
    if (!password) return setError("Enter your current password to confirm.");
    setError(null);
    setPending(true);
    try {
      const updated = await authed((token) => authApi.changeEmail(token, next, password));
      updateUser(updated);
      setPassword("");
      toast.success("Email updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-line bg-white p-6"
      noValidate
    >
      <h2 className="text-lg font-bold">Email</h2>
      <Field
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Field
        label="Current password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <FormError message={error} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
        {pending ? "Saving…" : "Change email"}
      </button>
    </form>
  );
}

function PasswordForm() {
  const { authed } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof values) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.current) return setError("Enter your current password.");
    const invalid = validateNewPassword(values.next, values.confirm);
    if (invalid) return setError(invalid);
    if (values.next === values.current) return setError("Choose a different password.");
    setError(null);
    setPending(true);
    try {
      await authed((token) => authApi.changePassword(token, values.current, values.next));
      setValues({ current: "", next: "", confirm: "" });
      toast.success("Password updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-line bg-white p-6"
      noValidate
    >
      <h2 className="text-lg font-bold">Password</h2>
      <Field
        label="Current password"
        type="password"
        value={values.current}
        onChange={set("current")}
        autoComplete="current-password"
      />
      <Field
        label="New password"
        type="password"
        value={values.next}
        onChange={set("next")}
        autoComplete="new-password"
      />
      <Field
        label="Confirm new password"
        type="password"
        value={values.confirm}
        onChange={set("confirm")}
        autoComplete="new-password"
      />
      <FormError message={error} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}

function AddressCard({
  address,
  busy,
  onEdit,
  onDefault,
  onDelete,
}: {
  address: Address;
  busy: boolean;
  onEdit: () => void;
  onDefault: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-2xl border border-line bg-white p-5 text-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-bold">{address.recipient_name}</p>
        {address.label && (
          <span className="rounded-full bg-[#f2f2f2] px-2.5 py-0.5 text-xs font-semibold">
            {address.label}
          </span>
        )}
        {address.is_default && (
          <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-white">
            Default
          </span>
        )}
      </div>
      <p className="mt-1 text-muted">{address.phone}</p>
      <p className="mt-2">
        {address.address_line}, {address.city}
        {address.postal_code ? ` ${address.postal_code}` : ""}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={onEdit}
          disabled={busy}
          className="rounded-full border border-line px-3 py-1.5 hover:border-ink disabled:opacity-50"
        >
          Edit
        </button>
        {!address.is_default && (
          <button
            type="button"
            onClick={onDefault}
            disabled={busy}
            className="rounded-full border border-line px-3 py-1.5 hover:border-ink disabled:opacity-50"
          >
            Make default
          </button>
        )}
        {confirming ? (
          <>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                onDelete();
              }}
              disabled={busy}
              className="rounded-full bg-coral px-3 py-1.5 text-white"
            >
              Confirm
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-muted">
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={busy}
            className="rounded-full px-3 py-1.5 text-coral hover:bg-coral/10 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </motion.li>
  );
}

function Addresses() {
  const { authed } = useAuth();
  const toast = useToast();
  const { state, reload } = useAuthedQuery("profile-addresses", (token) => addressApi.list(token));
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: (token: string) => Promise<unknown>, done: string) {
    setBusy(true);
    try {
      await authed(action);
      toast.success(done);
      reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Addresses</h2>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Add address
          </button>
        )}
      </div>

      <QueryView state={state} reload={reload}>
        {(addresses) => (
          <div className="space-y-4">
            {editing === "new" && (
              <AddressForm
                onCancel={() => setEditing(null)}
                onSaved={() => {
                  setEditing(null);
                  reload();
                }}
              />
            )}
            {addresses.length === 0 && editing !== "new" && (
              <p className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
                No saved addresses yet.
              </p>
            )}
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {addresses.map((address) =>
                  editing === address.id ? (
                    <li key={address.id}>
                      <AddressForm
                        address={address}
                        onCancel={() => setEditing(null)}
                        onSaved={() => {
                          setEditing(null);
                          reload();
                        }}
                      />
                    </li>
                  ) : (
                    <AddressCard
                      key={address.id}
                      address={address}
                      busy={busy}
                      onEdit={() => setEditing(address.id)}
                      onDefault={() =>
                        run(
                          (token) => addressApi.setDefault(token, address.id),
                          "Default address updated",
                        )
                      }
                      onDelete={() =>
                        run((token) => addressApi.remove(token, address.id), "Address deleted")
                      }
                    />
                  ),
                )}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </QueryView>
    </section>
  );
}

export function ProfileView() {
  const { state, reload } = useAuthedQuery("profile", (token) => profileApi.get(token));
  return (
    <div className="grid items-start gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        <AccountCard />
        <QueryView state={state} reload={reload}>
          {(profile) => (
            <ProfileForm key={profile?.id ?? "new"} profile={profile} onSaved={reload} />
          )}
        </QueryView>
      </div>
      <div className="space-y-6">
        <Addresses />
        <EmailForm />
        <PasswordForm />
      </div>
    </div>
  );
}

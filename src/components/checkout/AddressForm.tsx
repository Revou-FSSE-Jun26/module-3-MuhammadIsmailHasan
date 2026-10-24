"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormError, buttonClass } from "@/components/auth/AuthShell";
import { useToast } from "@/components/ui/ToastProvider";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError, addressApi } from "@/lib/api";
import type { Address } from "@/lib/types";

const EMPTY = {
  label: "",
  recipient_name: "",
  phone: "",
  address_line: "",
  city: "",
  postal_code: "",
};

export function AddressForm({
  onCreated,
  onCancel,
}: {
  onCreated: (address: Address) => void;
  onCancel?: () => void;
}) {
  const { authed } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      !values.recipient_name.trim() ||
      !values.phone.trim() ||
      !values.address_line.trim() ||
      !values.city.trim()
    ) {
      return setError("Name, phone, address and city are required.");
    }
    setError(null);
    setPending(true);
    try {
      const created = await authed((token) =>
        addressApi.create(token, {
          label: values.label.trim() || undefined,
          recipient_name: values.recipient_name.trim(),
          phone: values.phone.trim(),
          address_line: values.address_line.trim(),
          city: values.city.trim(),
          postal_code: values.postal_code.trim() || undefined,
        }),
      );
      toast.success("Address saved");
      onCreated(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-line bg-white p-5"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Recipient name"
          value={values.recipient_name}
          onChange={set("recipient_name")}
          autoComplete="name"
        />
        <Field
          label="Phone"
          value={values.phone}
          onChange={set("phone")}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>
      <Field
        label="Address"
        value={values.address_line}
        onChange={set("address_line")}
        autoComplete="street-address"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="City"
          value={values.city}
          onChange={set("city")}
          autoComplete="address-level2"
        />
        <Field
          label="Postal code"
          value={values.postal_code}
          onChange={set("postal_code")}
          autoComplete="postal-code"
        />
        <Field
          label="Label (optional)"
          value={values.label}
          onChange={set("label")}
          placeholder="Home, Office…"
        />
      </div>
      <FormError message={error} />
      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
          {pending ? "Saving…" : "Save address"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-line px-6 text-sm font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

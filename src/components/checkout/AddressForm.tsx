"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormError, buttonClass } from "@/components/auth/AuthShell";
import { useToast } from "@/components/ui/ToastProvider";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError, addressApi } from "@/lib/api";
import { PHONE_HINT, isValidPhone, sanitizePhone } from "@/lib/validation";
import type { Address } from "@/lib/types";

const EMPTY = {
  label: "",
  recipient_name: "",
  phone: "",
  address_line: "",
  city: "",
  postal_code: "",
};

function fromAddress(address?: Address) {
  if (!address) return EMPTY;
  return {
    label: address.label ?? "",
    recipient_name: address.recipient_name,
    phone: address.phone,
    address_line: address.address_line,
    city: address.city,
    postal_code: address.postal_code ?? "",
  };
}

export function AddressForm({
  address,
  onSaved,
  onCancel,
}: {
  address?: Address;
  onSaved: (address: Address) => void;
  onCancel?: () => void;
}) {
  const { authed } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState(() => fromAddress(address));
  const [makeDefault, setMakeDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({
      ...v,
      [key]: key === "phone" ? sanitizePhone(e.target.value) : e.target.value,
    }));

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
    if (!isValidPhone(values.phone.trim())) return setError(PHONE_HINT);
    setError(null);
    setPending(true);
    try {
      const payload = {
        label: values.label.trim() || undefined,
        recipient_name: values.recipient_name.trim(),
        phone: values.phone.trim(),
        address_line: values.address_line.trim(),
        city: values.city.trim(),
        postal_code: values.postal_code.trim() || undefined,
      };
      const saved = await authed((token) =>
        address
          ? addressApi.update(token, address.id, payload)
          : addressApi.create(token, { ...payload, is_default: makeDefault || undefined }),
      );
      toast.success(address ? "Address updated" : "Address saved");
      onSaved(saved);
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
      {!address && (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={makeDefault}
            onChange={(e) => setMakeDefault(e.target.checked)}
            className="size-4 accent-ink"
          />
          Set as default address
        </label>
      )}
      <FormError message={error} />
      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
          {pending ? "Saving…" : address ? "Save changes" : "Save address"}
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

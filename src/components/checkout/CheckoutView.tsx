"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { useToast } from "@/components/ui/ToastProvider";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthedQuery } from "@/hooks/useAuthedQuery";
import { ApiError, addressApi, orderApi } from "@/lib/api";
import { buildOrderPayload } from "@/lib/checkout";
import { cn, formatPrice } from "@/lib/format";
import type { Address } from "@/lib/types";
import { AddressForm } from "./AddressForm";

export function CheckoutView() {
  return (
    <RequireRole allow={["buyer"]}>
      <Checkout />
    </RequireRole>
  );
}

function Checkout() {
  const { authed } = useAuth();
  const toast = useToast();
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const { state, reload } = useAuthedQuery("addresses", (token) => addressApi.list(token));
  const [chosen, setChosen] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const addresses: Address[] = state.status === "ready" ? state.data : [];
  const selected = chosen ?? addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? null;
  const showForm = adding || (state.status === "ready" && addresses.length === 0);

  async function placeOrder() {
    setError(null);
    setPending(true);
    try {
      const order = await authed((token) =>
        orderApi.create(token, buildOrderPayload(items, selected)),
      );
      clear();
      toast.success("Order placed");
      router.replace(`/dashboard/buyer/orders/${order.id}?placed=1`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
      setPending(false);
    }
  }

  if (items.length === 0 && !pending) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add something you like, then come back to check out.</p>
        <Link
          href="/collections/all"
          className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px]">
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
        <h2 className="mt-8 text-lg font-bold">Shipping address</h2>

        {state.status === "loading" && (
          <div className="mt-4 flex items-center gap-3 text-sm text-muted">
            <Spinner className="text-ink" /> Loading addresses…
          </div>
        )}
        {state.status === "error" && (
          <p className="mt-4 text-sm text-coral">
            {state.message}{" "}
            <button type="button" onClick={reload} className="font-semibold underline">
              Retry
            </button>
          </p>
        )}

        {state.status === "ready" && addresses.length > 0 && (
          <ul className="mt-4 space-y-3">
            {addresses.map((a) => (
              <li key={a.id}>
                <label
                  className={cn(
                    "flex cursor-pointer gap-4 rounded-2xl border p-4 transition",
                    selected === a.id ? "border-ink shadow-md" : "border-line hover:border-ink",
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selected === a.id}
                    onChange={() => setChosen(a.id)}
                    className="mt-1 accent-black"
                  />
                  <span className="text-sm">
                    <span className="block font-bold">
                      {a.recipient_name}
                      {a.label && (
                        <span className="ml-2 rounded-full bg-[#f2f2f2] px-2 py-0.5 text-xs font-medium">
                          {a.label}
                        </span>
                      )}
                      {a.is_default && (
                        <span className="ml-2 text-xs font-medium text-muted">Default</span>
                      )}
                    </span>
                    <span className="block text-muted">{a.phone}</span>
                    <span className="block">
                      {a.address_line}, {a.city} {a.postal_code}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4">
          {showForm ? (
            <AddressForm
              onCancel={addresses.length ? () => setAdding(false) : undefined}
              onCreated={(created) => {
                setChosen(created.id);
                setAdding(false);
                reload();
              }}
            />
          ) : (
            state.status === "ready" && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="text-sm font-semibold underline underline-offset-4"
              >
                + Add a new address
              </button>
            )
          )}
        </div>
      </section>

      <aside className="h-fit rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-bold">Order summary</h2>
        <ul className="mt-4 divide-y divide-line">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-3 py-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2]">
                <ProductImage
                  src={product.image}
                  alt={product.title}
                  id={product.id}
                  sizes="64px"
                  className="p-1"
                />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="line-clamp-2 font-semibold">{product.title}</p>
                <p className="text-muted">
                  {quantity} × {formatPrice(product.price)}
                </p>
              </div>
              <p className="text-sm font-bold">{formatPrice(product.price * quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 font-bold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-coral"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={placeOrder}
          disabled={pending || selected === null}
          className="mt-5 h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
        >
          {pending && <Spinner className="mr-2 size-4 align-[-3px]" />}
          {pending ? "Placing order…" : "Place order"}
        </button>
        {selected === null && state.status === "ready" && (
          <p className="mt-2 text-center text-xs text-muted">Add a shipping address to continue.</p>
        )}
        <p className="mt-3 text-center text-xs text-muted">Online payment is not enabled yet.</p>
      </aside>
    </div>
  );
}

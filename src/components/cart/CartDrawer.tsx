"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { ProductImage } from "@/components/product/ProductImage";
import { loginUrl } from "@/lib/auth";
import { cn, formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export function CartDrawer() {
  const {
    isOpen,
    close,
    items,
    groups,
    selectedCount,
    selectedSubtotal,
    isSelected,
    toggleSelect,
    setGroupSelected,
    setAllSelected,
    setQuantity,
    remove,
    loading,
    loadFailed,
    reload,
    isGuest,
    busy,
  } = useCart();
  const router = useRouter();
  const allSelected = items.length > 0 && items.every((i) => isSelected(i.product.id));
  const threshold = siteConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - selectedSubtotal);
  const progress = Math.min(1, selectedSubtotal / threshold);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 34,
            }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">Your cart</h2>
                {busy && (
                  <span
                    className="flex items-center gap-2 text-xs font-medium text-muted"
                    role="status"
                  >
                    <Spinner className="size-3.5 text-ink" /> Saving…
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                className="grid size-11 place-items-center rounded-full hover:bg-[#f3f3f3]"
                aria-label="Close cart"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="border-b border-line px-6 py-4">
              <p className="text-sm">
                {remaining > 0 ? (
                  <>
                    Spend <b>{formatPrice(remaining)}</b> more for free shipping
                  </>
                ) : (
                  <b>You&apos;ve unlocked free shipping!</b>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eee]">
                <motion.div
                  className="h-full rounded-full bg-teal"
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {isGuest ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <span className="grid size-20 place-items-center rounded-full bg-[#f3f3f3]">
                    <Icon name="bag" size={32} />
                  </span>
                  <p className="font-semibold">Sign in to see your cart</p>
                  <p className="max-w-xs text-sm text-muted">
                    Your cart is saved to your account, so it follows you on any device.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      router.push(loginUrl());
                    }}
                    className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
                  >
                    Sign in
                  </button>
                </div>
              ) : loading ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted">
                  <Spinner className="size-6 text-ink" />
                  Loading your cart…
                  <span className="max-w-xs text-center text-xs">
                    The first request can take up to a minute while the server wakes up.
                  </span>
                </div>
              ) : loadFailed && items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="font-semibold">Could not load your cart</p>
                  <button
                    type="button"
                    onClick={reload}
                    className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
                  >
                    Try again
                  </button>
                </div>
              ) : items.length === 0 ? (
                <motion.div
                  className="flex h-full flex-col items-center justify-center gap-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="grid size-20 place-items-center rounded-full bg-[#f3f3f3]">
                    <Icon name="bag" size={32} />
                  </span>
                  <p className="font-semibold">Your cart is empty</p>
                  <Link
                    href="/collections/all"
                    onClick={close}
                    className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
                  >
                    Continue shopping
                  </Link>
                </motion.div>
              ) : (
                <div className="pb-4">
                  <label className="flex items-center gap-3 py-4 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => setAllSelected(e.target.checked)}
                      className="size-4 accent-black"
                    />
                    Select all ({items.length})
                  </label>
                  <ul className="space-y-4">
                    {groups.map((group) => {
                      const groupChecked = group.items.every((i) => isSelected(i.product.id));
                      return (
                        <li key={group.key} className="rounded-2xl border border-line">
                          <label className="flex items-center gap-3 border-b border-line px-4 py-3 text-sm font-bold">
                            <input
                              type="checkbox"
                              checked={groupChecked}
                              onChange={(e) => setGroupSelected(group.key, e.target.checked)}
                              className="size-4 accent-black"
                            />
                            {group.sellerName}
                          </label>
                          <ul className="divide-y divide-line px-4">
                            <AnimatePresence initial={false}>
                              {group.items.map(
                                ({ product, quantity, note, available, pending }) => (
                                  <motion.li
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{
                                      opacity: 0,
                                      x: 40,
                                      height: 0,
                                      paddingTop: 0,
                                      paddingBottom: 0,
                                    }}
                                    transition={{ duration: 0.35 }}
                                    className={cn(
                                      "flex gap-3 overflow-hidden py-4 transition-opacity",
                                      pending && "opacity-60",
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected(product.id)}
                                      onChange={() => toggleSelect(product.id)}
                                      aria-label={`Select ${product.title}`}
                                      className="mt-1 size-4 shrink-0 accent-black"
                                    />
                                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[#f2f2f2]">
                                      <ProductImage
                                        src={product.image}
                                        alt={product.title}
                                        id={product.id}
                                        sizes="64px"
                                        className="p-2"
                                      />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col">
                                      <Link
                                        href={`/products/${product.slug}`}
                                        onClick={close}
                                        className="line-clamp-2 text-sm font-semibold hover:underline"
                                      >
                                        {product.title}
                                      </Link>
                                      <span className="mt-1 text-sm text-muted">
                                        {formatPrice(product.price)}
                                      </span>
                                      {note && (
                                        <span
                                          className={
                                            available === false
                                              ? "text-xs text-coral"
                                              : "text-xs text-muted"
                                          }
                                        >
                                          {note}
                                        </span>
                                      )}
                                      <div className="mt-auto flex items-center justify-between pt-2">
                                        <QuantityStepper
                                          value={quantity}
                                          onChange={(q) => setQuantity(product.id, q)}
                                          label={product.title}
                                          disabled={pending}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => remove(product.id)}
                                          disabled={pending}
                                          className="text-xs text-muted underline hover:text-ink disabled:opacity-40"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </motion.li>
                                ),
                              )}
                            </AnimatePresence>
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="flex justify-between text-base font-bold">
                  <span>Subtotal ({selectedCount})</span>
                  <motion.span
                    key={selectedSubtotal}
                    initial={{ opacity: 0.4, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formatPrice(selectedSubtotal)}
                  </motion.span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Orders are placed separately for each seller.
                </p>
                {selectedCount > 0 ? (
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="mt-4 grid h-12 w-full place-items-center rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-black"
                  >
                    Checkout ({selectedCount})
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="mt-4 grid h-12 w-full cursor-not-allowed place-items-center rounded-full bg-ink/40 text-sm font-semibold text-white"
                  >
                    Select items to check out
                  </span>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function QuantityStepper({
  value,
  onChange,
  label,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center rounded-full border border-line">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled}
        className="grid size-9 place-items-center disabled:opacity-40"
        aria-label={`Decrease quantity of ${label}`}
      >
        <Icon name="minus" size={14} />
      </button>
      <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled}
        className="grid size-9 place-items-center disabled:opacity-40"
        aria-label={`Increase quantity of ${label}`}
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

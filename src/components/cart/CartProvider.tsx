"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  remove: (id: number) => void;
  wishlist: number[];
  toggleWish: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type Stored = { items: CartItem[]; wishlist: number[] };

const STORAGE_KEY = "theme-cart-v1";
const EMPTY: Stored = { items: [], wishlist: [] };

// Cached copy: React needs the exact same object back until the data really changes.
let snapshot: Stored | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Stored {
  if (snapshot === null) {
    snapshot = EMPTY;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Stored>;
        snapshot = { items: saved.items ?? [], wishlist: saved.wishlist ?? [] };
      }
    } catch {
      /* storage unavailable or invalid JSON: start with an empty cart */
    }
  }
  return snapshot;
}

function getServerSnapshot(): Stored {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function update(change: (current: Stored) => Stored) {
  snapshot = change(getSnapshot());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((notify) => notify());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, wishlist } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback((product: Product, quantity = 1) => {
    update((current) => {
      const existing = current.items.find((i) => i.product.id === product.id);
      const nextItems = existing
        ? current.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...current.items, { product, quantity }];
      return { ...current, items: nextItems };
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((id: number, quantity: number) => {
    update((current) => ({
      ...current,
      items:
        quantity <= 0
          ? current.items.filter((i) => i.product.id !== id)
          : current.items.map((i) => (i.product.id === id ? { ...i, quantity } : i)),
    }));
  }, []);

  const remove = useCallback((id: number) => {
    update((current) => ({ ...current, items: current.items.filter((i) => i.product.id !== id) }));
  }, []);

  const toggleWish = useCallback((id: number) => {
    update((current) => ({
      ...current,
      wishlist: current.wishlist.includes(id)
        ? current.wishlist.filter((x) => x !== id)
        : [...current.wishlist, id],
    }));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.quantity * i.product.price, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      wishlist,
      toggleWish,
    };
  }, [items, isOpen, add, setQuantity, remove, wishlist, toggleWish]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

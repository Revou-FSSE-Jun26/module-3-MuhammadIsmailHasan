"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError, cartApi, productApi, toCartItems, toProduct } from "@/lib/api";
import { loginUrl } from "@/lib/auth";
import { clampQuantity } from "@/lib/cart";
import type { ApiCart, CartGroup, CartItem, Order, Product } from "@/lib/types";

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
  clear: () => void;
  checkout: (addressId: number | null) => Promise<Order[]>;
  groups: CartGroup[];
  selectedItems: CartItem[];
  selectedCount: number;
  selectedSubtotal: number;
  isSelected: (productId: number) => boolean;
  toggleSelect: (productId: number) => void;
  setGroupSelected: (key: string, selected: boolean) => void;
  setAllSelected: (selected: boolean) => void;
  busy: boolean;
  loading: boolean;
  loadFailed: boolean;
  reload: () => void;
  canShop: boolean;
  isGuest: boolean;
  wishlist: number[];
  toggleWish: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type Stored = { wishlist: number[] };

const STORAGE_KEY = "revoshop-cart-v1";
const EMPTY: Stored = { wishlist: [] };

let snapshot: Stored | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Stored {
  if (snapshot === null) {
    snapshot = EMPTY;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Stored>;
        snapshot = { wishlist: saved.wishlist ?? [] };
      }
    } catch {
      /* storage unavailable or invalid JSON: start with an empty wishlist */
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

type ServerCart = { userId: number; items: CartItem[] };

export function CartProvider({ children }: { children: ReactNode }) {
  const local = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { user, status, authed } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [server, setServer] = useState<ServerCart | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [deselected, setDeselected] = useState<number[]>([]);
  const [imageFix, setImageFix] = useState<Record<number, string>>({});
  const loadedFor = useRef<number | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const inflight = useRef(0);
  const failed = useRef(false);
  const requestedImages = useRef(new Set<number>());

  const buyerId = status === "ready" && user?.role === "buyer" ? user.id : null;
  const isGuest = status === "ready" && !user;
  const canShop = !user || user.role === "buyer";
  const serverReady = buyerId !== null && server?.userId === buyerId;
  const loading = buyerId !== null && !serverReady && !loadFailed;

  const items = useMemo(() => {
    if (buyerId === null || !serverReady) return [];
    return server.items.map((item) => {
      const fixed = imageFix[item.product.id];
      return fixed
        ? { ...item, product: { ...item.product, image: fixed, images: [fixed] } }
        : item;
    });
  }, [buyerId, serverReady, server, imageFix]);
  const groups = useMemo<CartGroup[]>(() => {
    const byKey = new Map<string, CartGroup>();
    for (const item of items) {
      const key = String(item.sellerId ?? "unknown");
      const group = byKey.get(key) ?? {
        key,
        sellerId: item.sellerId ?? null,
        sellerName: item.sellerName ?? "Unknown seller",
        items: [],
      };
      group.items.push(item);
      byKey.set(key, group);
    }
    return [...byKey.values()];
  }, [items]);

  const selectedItems = useMemo(
    () => items.filter((i) => !deselected.includes(i.product.id)),
    [items, deselected],
  );

  const isSelected = useCallback(
    (productId: number) => !deselected.includes(productId),
    [deselected],
  );

  const toggleSelect = useCallback((productId: number) => {
    setDeselected((current) =>
      current.includes(productId)
        ? current.filter((x) => x !== productId)
        : [...current, productId],
    );
  }, []);

  const setGroupSelected = useCallback(
    (key: string, selected: boolean) => {
      const ids = groups.find((g) => g.key === key)?.items.map((i) => i.product.id) ?? [];
      setDeselected((current) =>
        selected ? current.filter((x) => !ids.includes(x)) : [...new Set([...current, ...ids])],
      );
    },
    [groups],
  );

  const setAllSelected = useCallback(
    (selected: boolean) => {
      setDeselected(selected ? [] : items.map((i) => i.product.id));
    },
    [items],
  );

  const wishlist = useMemo(() => (canShop ? local.wishlist : []), [canShop, local.wishlist]);

  const apply = useCallback((userId: number, cart: ApiCart) => {
    setServer({ userId, items: toCartItems(cart) });
  }, []);

  const enqueue = useCallback(
    (
      userId: number,
      action: (token: string) => Promise<ApiCart>,
      options: {
        optimistic?: (current: CartItem[]) => CartItem[];
        onFail?: (error: unknown) => void;
      } = {},
    ) => {
      const { optimistic, onFail } = options;
      if (optimistic) {
        setServer((current) => ({
          userId,
          items: optimistic(current?.userId === userId ? current.items : []),
        }));
      }
      inflight.current += 1;
      setBusy(true);
      queue.current = queue.current.then(async () => {
        try {
          const cart = await authed(action);
          if (inflight.current === 1) apply(userId, cart);
        } catch (error) {
          failed.current = true;
          if (onFail) onFail(error);
          else
            toast.error(error instanceof ApiError ? error.message : "Could not update your cart.");
        } finally {
          inflight.current -= 1;
          if (inflight.current === 0) {
            setBusy(false);
            if (failed.current) {
              failed.current = false;
              try {
                apply(userId, await authed((token) => cartApi.get(token)));
              } catch {
                setLoadFailed(true);
              }
            }
          }
        }
      });
    },
    [authed, apply, toast],
  );

  useEffect(() => {
    if (buyerId === null) {
      loadedFor.current = null;
      return;
    }
    if (loadedFor.current === buyerId) return;
    loadedFor.current = buyerId;
    enqueue(buyerId, (token) => cartApi.get(token), {
      onFail: () => {
        loadedFor.current = null;
        setLoadFailed(true);
      },
    });
  }, [buyerId, attempt, enqueue]);

  useEffect(() => {
    if (!serverReady) return;
    const missing = server.items
      .filter((i) => i.needsImage && !requestedImages.current.has(i.product.id))
      .map((i) => i.product.id);
    if (missing.length === 0) return;
    missing.forEach((id) => requestedImages.current.add(id));
    Promise.allSettled(missing.map((id) => productApi.get(id))).then((results) => {
      const found: Record<number, string> = {};
      results.forEach((result) => {
        if (result.status !== "fulfilled") return;
        const product = toProduct(result.value);
        if (product.image) found[product.id] = product.image;
      });
      setImageFix((prev) => ({ ...prev, ...found }));
    });
  }, [serverReady, server]);

  const reload = useCallback(() => {
    setLoadFailed(false);
    setAttempt((n) => n + 1);
  }, []);

  const add = useCallback(
    (product: Product, quantity = 1) => {
      if (!canShop || status !== "ready") return;
      if (buyerId === null) {
        router.push(loginUrl());
        return;
      }
      if (product.image) setImageFix((prev) => ({ ...prev, [product.id]: product.image }));
      setIsOpen(true);
      enqueue(buyerId, (token) => cartApi.add(token, product.id, quantity), {
        optimistic: (current) => {
          const existing = current.find((i) => i.product.id === product.id);
          if (existing) {
            return current.map((i) =>
              i.product.id === product.id
                ? {
                    ...i,
                    quantity: clampQuantity(i.quantity + quantity, i.product.stock),
                    pending: true,
                  }
                : i,
            );
          }
          return [
            ...current,
            {
              product,
              quantity: clampQuantity(quantity, product.stock),
              pending: true,
              sellerId: product.seller?.id ?? null,
              sellerName: product.seller?.name ?? null,
            },
          ];
        },
      });
    },
    [canShop, status, buyerId, router, enqueue],
  );

  const setQuantity = useCallback(
    (id: number, quantity: number) => {
      if (buyerId === null) return;
      const item = items.find((i) => i.product.id === id);
      if (!item?.itemId || item.pending) return;
      const itemId = item.itemId;
      const next = quantity <= 0 ? 0 : clampQuantity(quantity, item.product.stock);
      enqueue(buyerId, (token) => cartApi.setQuantity(token, itemId, next), {
        optimistic: (current) =>
          next === 0
            ? current.filter((i) => i.product.id !== id)
            : current.map((i) => (i.product.id === id ? { ...i, quantity: next } : i)),
      });
    },
    [buyerId, items, enqueue],
  );

  const remove = useCallback(
    (id: number) => {
      if (buyerId === null) return;
      const item = items.find((i) => i.product.id === id);
      if (!item?.itemId || item.pending) return;
      const itemId = item.itemId;
      enqueue(buyerId, (token) => cartApi.remove(token, itemId), {
        optimistic: (current) => current.filter((i) => i.product.id !== id),
      });
    },
    [buyerId, items, enqueue],
  );

  const clear = useCallback(() => {
    if (buyerId === null) return;
    enqueue(buyerId, (token) => cartApi.clear(token), { optimistic: () => [] });
  }, [buyerId, enqueue]);

  const checkout = useCallback(
    async (addressId: number | null) => {
      if (buyerId === null) throw new ApiError(403, "Only buyers can check out.");
      await queue.current;
      const ids = selectedItems.flatMap((i) => (i.itemId ? [i.itemId] : []));
      if (ids.length === 0) throw new ApiError(400, "Select at least one item to check out.");
      const orders = await authed((token) =>
        cartApi.checkout(token, {
          cart_item_ids: ids,
          ...(addressId ? { address_id: addressId } : {}),
        }),
      );
      apply(buyerId, await authed((token) => cartApi.get(token)));
      return orders;
    },
    [buyerId, selectedItems, authed, apply],
  );

  const toggleWish = useCallback(
    (id: number) => {
      if (!canShop) return;
      update((current) => ({
        wishlist: current.wishlist.includes(id)
          ? current.wishlist.filter((x) => x !== id)
          : [...current.wishlist, id],
      }));
    },
    [canShop],
  );

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.quantity * i.product.price, 0);
    const selectedCount = selectedItems.reduce((n, i) => n + i.quantity, 0);
    const selectedSubtotal = selectedItems.reduce((n, i) => n + i.quantity * i.product.price, 0);
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
      clear,
      checkout,
      groups,
      selectedItems,
      selectedCount,
      selectedSubtotal,
      isSelected,
      toggleSelect,
      setGroupSelected,
      setAllSelected,
      busy,
      loading,
      loadFailed,
      reload,
      canShop,
      isGuest,
      wishlist,
      toggleWish,
    };
  }, [
    items,
    isOpen,
    add,
    setQuantity,
    remove,
    clear,
    checkout,
    groups,
    selectedItems,
    isSelected,
    toggleSelect,
    setGroupSelected,
    setAllSelected,
    busy,
    loading,
    loadFailed,
    reload,
    canShop,
    isGuest,
    wishlist,
    toggleWish,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

import type { CartItem, CreateOrderPayload } from "./types";

export function buildOrderPayload(items: CartItem[], addressId: number | null): CreateOrderPayload {
  return {
    items: items.map(({ product, quantity }) => ({ product_id: product.id, quantity })),
    ...(addressId ? { address_id: addressId } : {}),
  };
}

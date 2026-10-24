export function clampQuantity(quantity: number, stock: number): number {
  return Math.min(stock, Math.max(1, quantity));
}

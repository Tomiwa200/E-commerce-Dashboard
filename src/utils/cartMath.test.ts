import { describe, it, expect } from "vitest";

// The pure mathematical engine logic from your checkout/cart systems
export function calculateOrderSummary(items: { price: number; quantity: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Free delivery over $100, else a $15 flat rate
  const logisticsFee = subtotal > 100 || subtotal === 0 ? 0 : 15; 
  return {
    subtotal,
    logisticsFee,
    grandTotal: subtotal + logisticsFee,
  };
}

describe("Cart Mathematical Calculation Engine", () => {
  it("should apply a shipping fee if the cart subtotal is under $100", () => {
    const mockCart = [{ price: 30, quantity: 2 }]; // Subtotal = $60
    const summary = calculateOrderSummary(mockCart);

    expect(summary.subtotal).toBe(60);
    expect(summary.logisticsFee).toBe(15);
    expect(summary.grandTotal).toBe(75);
  });

  it("should wave the shipping fee if the subtotal exceeds $100", () => {
    const mockCart = [
      { price: 50, quantity: 2 }, // $100
      { price: 20, quantity: 1 }, // $20
    ];
    const summary = calculateOrderSummary(mockCart);

    expect(summary.subtotal).toBe(120);
    expect(summary.logisticsFee).toBe(0);
    expect(summary.grandTotal).toBe(120);
  });
});

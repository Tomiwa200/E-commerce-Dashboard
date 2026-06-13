"use client";

import { useCartStore } from "@/store/useCartStore";

export default function CartItems() {
  const { cart } = useCartStore();
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <span>{totalCartItems || 0}</span>;
}
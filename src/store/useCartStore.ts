import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      
      addToCart: (newItem) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === newItem.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, newItem] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + delta } : item
            )
            .filter((item) => item.quantity > 0), // Automatically purges items dropped below 1 unit
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "ecommerce-cart-storage", 
      storage: createJSONStorage(() => 
      typeof window !== "undefined" ? window.localStorage : dummyStorage),
    }
  )
);

const dummyStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartSummary } from "../types/cart.types";

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Cart sheet drawer state

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getSummary: () => CartSummary;
  getItemCount: () => number;
}

const SHIPPING_THRESHOLD = 2999; // Free shipping above ₹2,999
const SHIPPING_COST = 199;
const TAX_RATE = 0.18; // 18% GST

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.product._id === newItem.product._id &&
              item.color === newItem.color
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product._id === newItem.product._id &&
                item.color === newItem.color
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.product._id !== productId
          ),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSummary: () => {
        const items = get().items;
        const subtotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const tax = Math.round(subtotal * TAX_RATE);
        const total = subtotal + shipping + tax;
        const itemCount = items.reduce(
          (count, item) => count + item.quantity,
          0
        );

        return { subtotal, shipping, tax, total, itemCount };
      },

      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: "tagx-cart", // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);

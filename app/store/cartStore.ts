import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string | number;
  title: string;
  category: string;
  description: string;
  weight: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  
  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  
  // Computed values
  totalItems: () => number;
  subtotal: () => number;
  isInCart: (id: string | number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        
        if (existingItem) {
          // If item exists, increment quantity
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          // Add new item with quantity 1
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
        }
        
        // Dispatch custom event for components that still listen
        window.dispatchEvent(new Event("cart-updated"));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        window.dispatchEvent(new Event("cart-updated"));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
        window.dispatchEvent(new Event("cart-updated"));
      },

      clearCart: () => {
        set({ items: [] });
        window.dispatchEvent(new Event("cart-updated"));
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.weight * item.quantity,
          0
        );
      },

      isInCart: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "cart-storage", // LocalStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
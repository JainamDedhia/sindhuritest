import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  id: string | number;
  title: string;
  category: string;
  description: string;
  weight: string;
  image: string;
  inStock: boolean;
}

interface WishlistStore {
  items: WishlistItem[];
  
  // Actions
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string | number) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  
  // Computed
  isWishlisted: (id: string | number) => boolean;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        // Prevent duplicates
        if (get().isWishlisted(item.id)) return;
        
        set((state) => ({
          items: [...state.items, item],
        }));
        window.dispatchEvent(new Event("wishlist-updated"));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        window.dispatchEvent(new Event("wishlist-updated"));
      },

      toggleItem: (item) => {
        const isAlreadyWishlisted = get().isWishlisted(item.id);
        
        if (isAlreadyWishlisted) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
        window.dispatchEvent(new Event("wishlist-updated"));
      },

      isWishlisted: (id) => {
        return get().items.some((item) => item.id === id);
      },

      totalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
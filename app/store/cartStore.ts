// app/store/cartStore.ts
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
  inStock?: boolean;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  isSynced: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeItem: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  clearCart: () => void;
  
  // Sync
  syncWithBackend: () => Promise<void>;
  loadFromBackend: () => Promise<void>;
  
  // 🔥 NEW: Handle logout
  handleLogout: () => void;
  
  // Computed
  totalItems: () => number;
  subtotal: () => number;
  isInCart: (id: string | number) => boolean;
  
  // Internal
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      isSynced: false,

      // ============= ADD ITEM =============
      addItem: async (item) => {
        set({ isLoading: true, error: null });
        
        try {
          // Add to local state immediately (optimistic update)
          const existingItem = get().items.find((i) => i.id === item.id);
          
          if (existingItem) {
            set((state) => ({
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }));
          } else {
            set((state) => ({
              items: [...state.items, { ...item, quantity: 1 }],
            }));
          }

          // Sync with backend
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: item.id })
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to add item");
          }

          const { items } = await res.json();
          set({ items, isSynced: true });
          
        } catch (error: any) {
          // Revert optimistic update on error
          await get().loadFromBackend();
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
        
        window.dispatchEvent(new Event("cart-updated"));
      },

      // ============= REMOVE ITEM =============
      removeItem: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Optimistic update
          const previousItems = get().items;
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));

          // Sync with backend
          const res = await fetch(`/api/cart/${id}`, {
            method: "DELETE"
          });

          if (!res.ok) {
            // Revert on error
            set({ items: previousItems });
            throw new Error("Failed to remove item");
          }

          const { items } = await res.json();
          set({ items, isSynced: true });
          
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
        
        window.dispatchEvent(new Event("cart-updated"));
      },

      // ============= UPDATE QUANTITY =============
      updateQuantity: async (id, quantity) => {
        if (quantity < 1) {
          return get().removeItem(id);
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Optimistic update
          const previousItems = get().items;
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          }));

          // Sync with backend
          const res = await fetch(`/api/cart/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity })
          });

          if (!res.ok) {
            // Revert on error
            set({ items: previousItems });
            throw new Error("Failed to update quantity");
          }

          const { items } = await res.json();
          set({ items, isSynced: true });
          
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
        
        window.dispatchEvent(new Event("cart-updated"));
      },

      // ============= CLEAR CART =============
      clearCart: () => {
        set({ items: [], isSynced: false });
        window.dispatchEvent(new Event("cart-updated"));
      },

      // ============= SYNC WITH BACKEND =============
      syncWithBackend: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const localItems = get().items.map(item => ({
            id: item.id,
            quantity: item.quantity
          }));

          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              syncLocal: true, 
              items: localItems 
            })
          });

          if (!res.ok) {
            throw new Error("Sync failed");
          }

          const { items } = await res.json();
          set({ items, isSynced: true });
          
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= LOAD FROM BACKEND =============
      loadFromBackend: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const res = await fetch("/api/cart");
          
          if (res.status === 401) {
            // User not logged in, use local storage
            set({ isSynced: false, isLoading: false });
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to load cart");
          }

          const items = await res.json();
          set({ items, isSynced: true });
          
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // 🔥 ============= HANDLE LOGOUT =============
      handleLogout: () => {
        console.log("🧹 Clearing cart on logout");
        set({ 
          items: [], 
          isSynced: false,
          isLoading: false,
          error: null
        });
        window.dispatchEvent(new Event("cart-updated"));
      },

      // ============= COMPUTED VALUES =============
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

      // ============= INTERNAL =============
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
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
  lastSyncTime: number;
  
  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeItem: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  clearCart: () => void;
  
  // Sync
  syncWithBackend: () => Promise<void>;
  loadFromBackend: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  
  // Logout
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
      lastSyncTime: 0,

      // ============= ADD ITEM (FIXED) =============
      addItem: async (item) => {
        const productId = String(item.id);
        set({ isLoading: true, error: null });
        
        try {
          // Call backend FIRST to ensure product is available
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId })
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to add item");
          }

          // Get fresh cart state from backend
          const { items } = await res.json();
          
          set({ 
            items, 
            isSynced: true,
            lastSyncTime: Date.now()
          });
          
          window.dispatchEvent(new Event("cart-updated"));
          
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= REMOVE ITEM (FIXED) =============
      removeItem: async (id) => {
        const productId = String(id);
        set({ isLoading: true, error: null });
        
        try {
          const res = await fetch(`/api/cart/${productId}`, {
            method: "DELETE"
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to remove item");
          }

          const { items } = await res.json();
          
          set({ 
            items, 
            isSynced: true,
            lastSyncTime: Date.now()
          });
          
          window.dispatchEvent(new Event("cart-updated"));
          
        } catch (error: any) {
          console.error("Remove item error:", error);
          set({ error: error.message });
          // Force refresh to get correct state
          await get().forceRefresh();
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= UPDATE QUANTITY (FIXED) =============
      updateQuantity: async (id, quantity) => {
        if (quantity < 1) {
          return get().removeItem(id);
        }
        
        const productId = String(id);
        set({ isLoading: true, error: null });
        
        try {
          const res = await fetch(`/api/cart/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity })
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to update quantity");
          }

          const { items } = await res.json();
          
          set({ 
            items, 
            isSynced: true,
            lastSyncTime: Date.now()
          });
          
          window.dispatchEvent(new Event("cart-updated"));
          
        } catch (error: any) {
          console.error("Update quantity error:", error);
          set({ error: error.message });
          // Force refresh to get correct state
          await get().forceRefresh();
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= CLEAR CART =============
      clearCart: () => {
        set({ items: [], isSynced: false, lastSyncTime: 0 });
        window.dispatchEvent(new Event("cart-updated"));
      },

      // ============= SYNC WITH BACKEND (IMPROVED) =============
      syncWithBackend: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const localItems = get().items.map(item => ({
            id: String(item.id),
            quantity: item.quantity
          }));

          // Only sync if we have local items
          if (localItems.length === 0) {
            await get().loadFromBackend();
            return;
          }

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
          
          set({ 
            items, 
            isSynced: true,
            lastSyncTime: Date.now()
          });
          
          window.dispatchEvent(new Event("cart-updated"));
          
        } catch (error: any) {
          console.error("Sync error:", error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= LOAD FROM BACKEND (IMPROVED) =============
      loadFromBackend: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const res = await fetch("/api/cart", {
            cache: 'no-store' // Prevent caching
          });
          
          if (res.status === 401) {
            // User not logged in
            set({ isSynced: false, isLoading: false });
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to load cart");
          }

          const items = await res.json();
          
          set({ 
            items, 
            isSynced: true,
            lastSyncTime: Date.now()
          });
          
          window.dispatchEvent(new Event("cart-updated"));
          
        } catch (error: any) {
          console.error("Load cart error:", error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= FORCE REFRESH (NEW) =============
      forceRefresh: async () => {
        console.log("🔄 Force refreshing cart...");
        await get().loadFromBackend();
      },

      // ============= HANDLE LOGOUT =============
      handleLogout: () => {
        console.log("🧹 Clearing cart on logout");
        set({ 
          items: [], 
          isSynced: false,
          isLoading: false,
          error: null,
          lastSyncTime: 0
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
        return get().items.some((item) => String(item.id) === String(id));
      },

      // ============= INTERNAL =============
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Merge strategy to prevent state conflicts
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        isLoading: false,
        error: null,
      }),
    }
  )
);
// app/store/wishlistStore.ts
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
  isLoading: boolean;
  error: string | null;
  isSynced: boolean;
  lastSyncTime: number;
  
  // Actions
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: string | number) => Promise<void>;
  toggleItem: (item: WishlistItem) => Promise<void>;
  clearWishlist: () => void;
  
  // Sync
  syncWithBackend: () => Promise<void>;
  loadFromBackend: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  
  // Logout
  handleLogout: () => void;
  
  // Computed
  isWishlisted: (id: string | number) => boolean;
  totalItems: () => number;
  
  // Internal
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      isSynced: false,
      lastSyncTime: 0,

      // ============= ADD ITEM =============
      addItem: async (item) => {
        const productId = String(item.id);
        set({ isLoading: true, error: null });
        
        try {
          // Call backend FIRST
          const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId })
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to add item");
          }

          // Get fresh wishlist state from backend
          const { items } = await res.json();
          
          set({ 
            items, 
            isSynced: true,
            lastSyncTime: Date.now()
          });
          
          window.dispatchEvent(new Event("wishlist-updated"));
          
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= REMOVE ITEM =============
      removeItem: async (id) => {
        const productId = String(id);
        set({ isLoading: true, error: null });
        
        try {
          const res = await fetch(`/api/wishlist/${productId}`, {
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
          
          window.dispatchEvent(new Event("wishlist-updated"));
          
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

      // ============= TOGGLE ITEM =============
      toggleItem: async (item) => {
        const isCurrentlyWishlisted = get().isWishlisted(item.id);
        
        if (isCurrentlyWishlisted) {
          await get().removeItem(item.id);
        } else {
          await get().addItem(item);
        }
      },

      // ============= CLEAR WISHLIST =============
      clearWishlist: () => {
        set({ items: [], isSynced: false, lastSyncTime: 0 });
        window.dispatchEvent(new Event("wishlist-updated"));
      },

      // ============= SYNC WITH BACKEND =============
      syncWithBackend: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const localItems = get().items.map(item => ({
            id: String(item.id)
          }));

          // Only sync if we have local items
          if (localItems.length === 0) {
            await get().loadFromBackend();
            return;
          }

          const res = await fetch("/api/wishlist", {
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
          
          window.dispatchEvent(new Event("wishlist-updated"));
          
        } catch (error: any) {
          console.error("Wishlist sync error:", error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= LOAD FROM BACKEND =============
      loadFromBackend: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const res = await fetch("/api/wishlist", {
            cache: 'no-store'
          });
          
          if (res.status === 401) {
            // User not logged in
            set({ isSynced: false, isLoading: false });
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to load wishlist");
          }

          const items = await res.json();
          
          set({ 
            items, 
            isSynced: true,
            lastSyncTime: Date.now()
          });
          
          window.dispatchEvent(new Event("wishlist-updated"));
          
        } catch (error: any) {
          console.error("Load wishlist error:", error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // ============= FORCE REFRESH =============
      forceRefresh: async () => {
        console.log("🔄 Force refreshing wishlist...");
        await get().loadFromBackend();
      },

      // ============= HANDLE LOGOUT =============
      handleLogout: () => {
        console.log("🧹 Clearing wishlist on logout");
        set({ 
          items: [], 
          isSynced: false,
          isLoading: false,
          error: null,
          lastSyncTime: 0
        });
        window.dispatchEvent(new Event("wishlist-updated"));
      },

      // ============= COMPUTED VALUES =============
      isWishlisted: (id) => {
        return get().items.some((item) => String(item.id) === String(id));
      },

      totalItems: () => {
        return get().items.length;
      },

      // ============= INTERNAL =============
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        isLoading: false,
        error: null,
      }),
    }
  )
);
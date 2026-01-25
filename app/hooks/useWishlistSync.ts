// app/hooks/useWishlistSync.ts
"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/app/store/wishlistStore";

/**
 * Enhanced wishlist sync with proper multi-device handling
 */
export function useWishlistSync() {
  const { data: session, status } = useSession();
  const { 
    loadFromBackend, 
    syncWithBackend, 
    isSynced, 
    items,
    lastSyncTime 
  } = useWishlistStore();
  
  const hasInitialized = useRef(false);
  const syncInterval = useRef<NodeJS.Timeout | null>(null);

  // ============= INITIAL SYNC ON LOGIN =============
  useEffect(() => {
    if (status === "loading") return;

    if (session?.user && !hasInitialized.current) {
      hasInitialized.current = true;
      
      const performInitialSync = async () => {
        console.log("🔄 Performing initial wishlist sync...");
        const hasLocalItems = items.length > 0;

        if (hasLocalItems && !isSynced) {
          console.log("📤 Syncing local wishlist to backend...");
          await syncWithBackend();
        } else {
          console.log("📥 Loading wishlist from backend...");
          await loadFromBackend();
        }
      };

      performInitialSync();
    }

    if (status === "unauthenticated") {
      hasInitialized.current = false;
    }
  }, [session, status, isSynced]);

  // ============= PERIODIC SYNC (EVERY 30 SECONDS) =============
  useEffect(() => {
    if (!session?.user) {
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
        syncInterval.current = null;
      }
      return;
    }

    syncInterval.current = setInterval(async () => {
      const timeSinceLastSync = Date.now() - lastSyncTime;
      
      if (timeSinceLastSync > 25000) {
        console.log("⏰ Periodic wishlist refresh...");
        await loadFromBackend();
      }
    }, 30000);

    return () => {
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
      }
    };
  }, [session, lastSyncTime, loadFromBackend]);

  // ============= VISIBILITY CHANGE SYNC =============
  useEffect(() => {
    if (!session?.user) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastSync = Date.now() - lastSyncTime;
        
        if (timeSinceLastSync > 10000) {
          console.log("👁️ Tab became visible, refreshing wishlist...");
          await loadFromBackend();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session, lastSyncTime, loadFromBackend]);
}
// app/wishlist/page.tsx
"use client";

import Link from "next/link";
import { HeartOff, ShoppingBag, RefreshCw, AlertCircle } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { data: session } = useSession();
  const { 
    items, 
    isLoading,
    error,
    forceRefresh,
    isSynced
  } = useWishlistStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh when page loads (if logged in)
  useEffect(() => {
    if (session?.user) {
      const refreshWishlist = async () => {
        setIsRefreshing(true);
        await forceRefresh();
        setIsRefreshing(false);
      };
      refreshWishlist();
    }
  }, [session]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await forceRefresh();
    setIsRefreshing(false);
  };

  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8">
      
      {/* HEADER WITH SYNC STATUS */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Wishlist ({items.length})</h1>
        
        <div className="flex items-center gap-3">
          {/* Sync Status Indicator */}
          {session?.user && (
            <div className="flex items-center gap-2 text-xs">
              {isRefreshing || isLoading ? (
                <span className="flex items-center gap-1 text-blue-600">
                  <RefreshCw size={12} className="animate-spin" />
                  Syncing...
                </span>
              ) : isSynced ? (
                <span className="flex items-center gap-1 text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Synced
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                  Local
                </span>
              )}
            </div>
          )}

          {/* Manual Refresh Button */}
          {session?.user && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle size={20} className="text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error syncing wishlist</p>
            <p className="text-xs text-red-700">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <HeartOff size={32} />
          </div>
          <div className="max-w-xs space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="text-sm text-gray-500">
              Looks like you haven't found your perfect piece yet.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-4 flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-gray-800"
          >
            <ShoppingBag size={16} />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 ${
          isLoading ? 'opacity-50' : ''
        }`}>
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.id,
                title: item.title,
                category: item.category,
                description: item.description,
                weight: item.weight,
                image: item.image,
                inStock: item.inStock,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
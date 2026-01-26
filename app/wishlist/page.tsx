// app/wishlist/page.tsx
"use client";

import Link from "next/link";
import { HeartOff, ShoppingBag, RefreshCw, Loader2 } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    items, 
    isLoading,
    error,
    forceRefresh,
  } = useWishlistStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔥 CLIENT-SIDE AUTH CHECK
  useEffect(() => {
    console.log("🔐 Wishlist page - Auth status:", status);
    
    if (status === "loading") {
      console.log("⏳ Waiting for session...");
      return;
    }
    
    if (status === "unauthenticated") {
      console.log("❌ Not authenticated, redirecting to login");
      router.replace("/auth/login?callbackUrl=/wishlist");
    } else if (status === "authenticated") {
      console.log("✅ Authenticated, loading wishlist");
      const refreshWishlist = async () => {
        setIsRefreshing(true);
        await forceRefresh();
        setIsRefreshing(false);
      };
      refreshWishlist();
    }
  }, [status, router, forceRefresh]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await forceRefresh();
    setIsRefreshing(false);
  };

  // 🔥 SHOW LOADING WHILE CHECKING AUTH
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--color-gold-primary)] mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔥 SHOW NOTHING WHILE REDIRECTING
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--color-gold-primary)] mx-auto mb-4" />
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8">
      
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Wishlist ({items.length})</h1>
        
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

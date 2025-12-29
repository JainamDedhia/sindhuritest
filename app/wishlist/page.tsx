"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartOff, ShoppingBag } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";

// Reuse the interface you already have
interface Product {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Load Wishlist from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    setLoading(false);
  }, []);

  // 2. Helper to remove item (passed to page logic, though usually handled in global state)
  const removeFromWishlist = (id: number) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  if (loading) return null; // Or a simple spinner

  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">My Wishlist ({wishlistItems.length})</h1>

      {wishlistItems.length === 0 ? (
        /* EMPTY STATE UI */
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
        /* WISHLIST GRID */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="relative">
              {/* We wrap ProductCard to add a 'Remove' capability if needed, 
                  or just render it as is. For now, rendering as is. */}
              <ProductCard
                product={item}
              />
              
              {/* Optional: Explicit Remove Button overlay if you want it distinct from the heart */}
              <button
                onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(item.id);
                }}
                className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 opacity-0 transition-opacity hover:bg-red-100 group-hover:opacity-100"
                title="Remove from wishlist"
              >
                <HeartOff size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
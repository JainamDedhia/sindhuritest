"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartOff, ShoppingBag } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";

// Match the interface that ProductCard expects
interface Product {
  id: number | string;
  title: string;
  category: string;
  description: string;
  weight: string;
  image: string;
  inStock: boolean;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        const items = JSON.parse(saved);
        setWishlistItems(items);
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    setLoading(false);
  }, []);

  const removeFromWishlist = (id: number | string) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  if (loading) return null;

  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">My Wishlist ({wishlistItems.length})</h1>

      {wishlistItems.length === 0 ? (
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
          {wishlistItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="relative group">
              <ProductCard product={item} />
              
              {/* Remove button overlay */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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
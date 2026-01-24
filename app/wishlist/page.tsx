"use client";

import Link from "next/link";
import { HeartOff, ShoppingBag } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { useWishlistStore } from "@/app/store/wishlistStore";

export default function WishlistPage() {
  // 🔥 USE ZUSTAND STORE
  const items = useWishlistStore((state) => state.items);

  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">My Wishlist ({items.length})</h1>

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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
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
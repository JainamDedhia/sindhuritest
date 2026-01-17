"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

// Define the shape of the product coming from the API
interface FeaturedProduct {
  id: string;
  name: string;
  weight: string;
  description: string;
  category_name: string;
  image: string;
  is_sold_out: boolean;
}

export default function FeaturedCollection() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/products/featured");
        
        // 1. Handle HTTP errors (like 404 or 500)
        if (!res.ok) {
          console.error("Featured API Error:", res.status, res.statusText);
          setProducts([]); // Fallback to empty list
          return;
        }

        const data = await res.json();

        // 2. SAFETY CHECK: Ensure data is actually an array before setting state
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Featured API returned invalid data (not an array):", data);
          setProducts([]); 
        }

      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Option: Hide the entire section if loading finishes and there are no products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
              Featured Collection
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Handpicked favorites just for you.
            </p>
          </div>
          
          <Link 
            href="/products" 
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-[var(--color-gold-primary)] transition-colors group"
          >
            View All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {loading ? (
            // Show 4 Skeletons while loading
            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            // Render Actual Products
            products.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  title: item.name,
                  description: item.description,
                  weight: item.weight,
                  category: item.category_name || "Jewelry",
                  image: item.image || "https://placehold.co/400x500", // Fallback image
                  inStock: !item.is_sold_out,
                }}
              />
            ))
          )}
        </div>

        {/* MOBILE 'VIEW ALL' BUTTON (Visible only on small screens) */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-0.5 hover:text-[var(--color-gold-primary)] hover:border-[var(--color-gold-primary)] transition-colors"
          >
            View Full Collection <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
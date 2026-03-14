"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
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

  // Hide the entire section if loading finishes and there are no products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ========================================= */}
        {/* BEAUTIFUL CENTERED HEADER */}
        {/* ========================================= */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 flex flex-col items-center">
          
          {/* Eyebrow / Subtitle */}
          <span className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#000000] mb-4">
            <Sparkles size={14} className="opacity-80" />
            Curated For You
            <Sparkles size={14} className="opacity-80" />
          </span>
          
          {/* Main Title */}
          <div className="bg-amber-50">
          <h2 className="font-serif text-4xl md:text-5xl leading-tight pb-2 text-transparent bg-clip-text bg-linear-to-r from-[#0e0725] via-[#e60b09]  to-[#0e0725] ">
            Featured Collection
          </h2>
          </div>
          {/* Elegant Gold Divider Line */}
          <div className="w-16 h-[1px] bg-[#000000]/60 mb-5" />
          
          {/* Description */}
          <p className="text-sm md:text-base text-[#5E4B4B] font-light leading-relaxed">
            Discover our most loved and sought-after masterpieces, handpicked to elevate your everyday elegance.
          </p>
        </div>

        {/* ========================================= */}
        {/* PRODUCT GRID */}
        {/* ========================================= */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
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
                  image: item.image || "https://placehold.co/400x500/F5F0E8/C8A45D?text=✦", // Elegantly styled fallback
                  inStock: !item.is_sold_out,
                }}
              />
            ))
          )}
        </div>

        {/* ========================================= */}
        {/* CENTERED 'VIEW ALL' BUTTON (All screens) */}
        {/* ========================================= */}
        <div className="mt-14 md:mt-20 text-center flex justify-center">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent border border-[#1A0A05] text-[#1A0A05] text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#1A0A05] hover:text-white transition-all duration-300 group"
          >
            Explore Full Collection 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
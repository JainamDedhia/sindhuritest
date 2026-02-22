"use client";

/**
 * CategoryBento.tsx — with Cloudinary image optimization
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
// Make sure this import is correct for your project structure
// import { getBentoTile } from "@/lib/imageOptimizer"; 

export default function CategoryBento() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/public/bento")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  if (items.length === 0) return null;

  const getCategoryFilterUrl = (categoryTitle: string) => {
    return `/products?category=${encodeURIComponent(categoryTitle)}`;
  };

  const getDesktopSizeClass = (size: string) => {
    switch(size) {
      case 'large': return "col-span-2 row-span-2";
      case 'wide': return "col-span-2";
      case 'tall': return "row-span-2";
      default: return "col-span-1";
    }
  };

  return (
    <section className="py-12 md:py-24 bg-white relative">
      
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 px-6">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#000000] block mb-3 opacity-90">
          Our Collections
        </span>
        <div className="bg-amber-50  m-5 opacity-100">
        <h2 className="font-serif text-4xl md:text-5xl bg-gradient-to-r from-[#0e0725] via-[#e60b09] via-[#e9d022] to-[#0e0725] bg-clip-text text-transparent pb-1">
          Shop by Category
        </h2>
        </div>
      </div>

      {/* ================= DESKTOP VIEW (Unchanged) ================= */}
      <div className="hidden lg:grid container mx-auto max-w-[1400px] px-8 grid-cols-4 gap-6 auto-rows-[300px]">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={getCategoryFilterUrl(item.title)}
            className={`group relative overflow-hidden rounded-2xl bg-gray-50 shadow-sm hover:shadow-2xl transition-all duration-700 ${getDesktopSizeClass(item.size)}`}
          >
            <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105">
              <OptimizedImage
                src={item.image_url}
                alt={item.title}
                priority={index === 0}
                width={600}
                height={600}
                quality={80}
                showBlur={true}
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 z-10">
               <div className="flex items-end justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-widest text-[#F3D6D1] mb-1 block">Collection</span>
                    <h3 className="font-serif text-3xl text-white tracking-wide">{item.title}</h3>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-full border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black">
                     <ArrowRight size={16} />
                  </div>
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ================= MOBILE VIEW (Uniform Grid) ================= */}
      <div className="lg:hidden px-5 flex flex-col gap-5">
        
        {/* Uniform 2-Column Grid for ALL items */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
             {items.map((item, index) => (
               <Link
                 key={item.id}
                 href={getCategoryFilterUrl(item.title)}
                 className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-sm bg-gray-50 group"
               >
                 <OptimizedImage
                   src={item.image_url}
                   alt={item.title}
                   width={300}
                   height={375}
                   priority={index < 2} // Load first row instantly
                   quality={75}
                   showBlur={true}
                   sizes="(max-width: 640px) 50vw, 33vw"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                 <div className="absolute bottom-4 inset-x-0 text-center px-2 z-10">
                    <h3 className="text-lg md:text-xl font-serif text-white tracking-wide drop-shadow-sm leading-tight">
                      {item.title}
                    </h3>
                 </div>
               </Link>
             ))}
          </div>
        )}

        <div className="mt-4 text-center pb-8 border-b border-gray-100">
           <Link 
             href="/products" 
             className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#4A3F35] hover:text-[#C8A45D] transition-colors py-2"
           >
              View All Categories <ArrowRight size={14} className="text-[#C8A45D]" />
           </Link>
        </div>

      </div>

    </section>
  );
}
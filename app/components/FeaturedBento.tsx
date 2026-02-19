"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

// 🔥 HELPER TO BUILD FILTER URL
const getCategoryFilterUrl = (title: string) => {
  const categoryName = encodeURIComponent(title);
  return `/products?category=${categoryName}`;
};

export default function FeaturedBento() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/public/featured-bento")
      .then(res => res.json())
      .then(data => {
        if (data.length >= 3) {
            setItems(data.slice().reverse().slice(0, 3)); 
        } else {
            setItems(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-[#FDFBF7] relative">
      
      {/* HEADER */}
      <div className="container mx-auto px-5 mb-10 text-center">
        <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C8A45D] mb-3">
          <Star size={10} fill="currentColor" /> Handpicked Favorites
        </span>
        <h2 className="font-serif text-4xl md:text-6xl leading-tight pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#0e0725] via-[#e60b09] via-[#e9d022] to-[#0e0725] ">
          Curated Gifting Edits
        </h2>
      </div>

      {/* BENTO GRID */}
      <div className="container mx-auto max-w-[1100px] px-5">
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 h-auto lg:h-[480px]">
          
          {/* 🔥 CARD 1 - HERO (FIXED) */}
          {items[0] && (
            <Link
              href={getCategoryFilterUrl(items[0].title)} // 🔥 FIXED
              className="group relative col-span-2 rounded-xl overflow-hidden cursor-pointer h-[320px] lg:h-full shadow-sm hover:shadow-2xl transition-all duration-700"
            >
              <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105">
                <img src={items[0].image_url} alt={items[0].title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0A0A] via-[#2A0A0A]/60 to-transparent opacity-95" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col items-center text-center z-10">
                 <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E5D3B3] mb-2 opacity-90">
                   Editor's Choice
                 </span>
                 <h3 className="text-3xl md:text-5xl font-serif text-white mb-3 drop-shadow-lg tracking-wide leading-tight">
                   {items[0].title}
                 </h3>
                 <div className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white border-b border-white/50 pb-1 group-hover:border-white transition-colors">
                    Explore Collection
                 </div>
              </div>
            </Link>
          )}

          {/* SECONDARY CARDS */}
          <div className="col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-5 h-auto lg:h-full">
            
            {/* 🔥 CARD 2 (FIXED) */}
            {items[1] && (
              <Link
                href={getCategoryFilterUrl(items[1].title)} // 🔥 FIXED
                className="group relative w-full h-[200px] lg:h-full rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <img src={items[1].image_url} alt={items[1].title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#660707] via-[#062C1D]/50 to-transparent opacity-90" />
                </div>
                
                <div className="absolute bottom-4 inset-x-0 text-center px-2">
                  <h3 className="text-xl md:text-2xl font-serif text-white drop-shadow-md leading-tight">
                    {items[1].title}
                  </h3>
                </div>
              </Link>
            )}

            {/* 🔥 CARD 3 (FIXED) */}
            {items[2] && (
              <Link
                href={getCategoryFilterUrl(items[2].title)} // 🔥 FIXED
                className="group relative w-full h-[200px] lg:h-full rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <img src={items[2].image_url} alt={items[2].title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#660707] via-[#120F2D]/50 to-transparent opacity-90" />
                </div>
                
                <div className="absolute bottom-4 inset-x-0 text-center px-2">
                  <h3 className="text-xl md:text-2xl font-serif text-white drop-shadow-md leading-tight">
                    {items[2].title}
                  </h3>
                </div>
              </Link>
            )}

          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="text-center mt-10 md:mt-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#5E4B4B] hover:text-black transition-colors opacity-70 hover:opacity-100">
           View All Collections <ArrowRight size={12} />
        </Link>
      </div>

    </section>
  );
}
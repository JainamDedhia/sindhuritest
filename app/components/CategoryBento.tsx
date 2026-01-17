"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CategoryBento() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/bento")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  if (items.length === 0) return null;

  // Helper for Desktop Bento Grid Classes
  const getSizeClass = (size: string) => {
    switch(size) {
      case 'large': return "col-span-2 row-span-2";
      case 'wide': return "col-span-2";
      case 'tall': return "row-span-2";
      default: return "col-span-1";
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-10 px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Shop by Category</h2>
        <p className="mt-2 text-sm text-gray-500">Curated collections for every occasion.</p>
      </div>

      {/* ================= DESKTOP VIEW (The Bento Grid) ================= */}
      {/* hidden lg:block -> Hides on mobile/tablet, Shows on Large Screens */}
      <div className="hidden lg:block container mx-auto max-w-6xl px-8">
        <div className="grid grid-cols-4 gap-4 auto-rows-[260px]">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.target_link}
              className={`group relative overflow-hidden rounded-2xl bg-gray-100 ${getSizeClass(item.size)}`}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="flex items-end justify-between translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-white">{item.title}</h3>
                    <div className="h-0.5 w-0 bg-[var(--color-gold-primary)] group-hover:w-full transition-all duration-500 mt-1" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= MOBILE/TABLET VIEW (Horizontal Scroller) ================= */}
      {/* block lg:hidden -> Shows on mobile/tablet, Hides on Desktop */}
      <div className="block lg:hidden w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.target_link}
              className="flex-shrink-0 relative w-[160px] h-[220px] rounded-xl overflow-hidden group"
            >
              <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
              
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3">
                 <h3 className="text-white font-medium text-sm text-center">{item.title}</h3>
              </div>
            </Link>
          ))}
          
          {/* Spacer to allow scrolling to the end */}
          <div className="w-2 flex-shrink-0" />
        </div>
      </div>

    </section>
  );
}
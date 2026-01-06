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

  // Helper to map DB 'size' string to Tailwind classes
  const getSizeClass = (size: string) => {
    switch(size) {
      case 'large': return "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2"; // Big Square
      case 'wide': return "col-span-1 row-span-1 sm:col-span-2"; // Wide Rectangle
      case 'tall': return "col-span-1 row-span-1 sm:row-span-2"; // Tall Rectangle
      default: return "col-span-1 row-span-1"; // Small Square
    }
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-white">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Shop by Category</h2>
        <p className="mt-3 text-sm text-gray-500">Curated collections for every occasion.</p>
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[260px]">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.target_link}
              className={`group relative overflow-hidden rounded-2xl bg-gray-100 ${getSizeClass(item.size)}`}
            >
              {/* IMAGE */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />
              </div>

              {/* TEXT */}
              <div className="absolute bottom-0 left-0 w-full p-5 md:p-8">
                <div className="flex items-end justify-between translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-medium text-white">{item.title}</h3>
                    <div className="h-0.5 w-0 bg-[var(--color-gold-primary)] group-hover:w-full transition-all duration-500 mt-1" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
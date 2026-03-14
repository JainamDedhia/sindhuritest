"use client";

import Link from "next/link";
import { Gem, Sparkles, Crown, Gift, Grid2X2, Component } from "lucide-react";

// 1. DESKTOP DATA (Elegant Line-Art Icons)
const desktopCategories = [
  { name: "All Jewellery", icon: Grid2X2, link: "/products" },
  { name: "Rings", icon: Component, link: "/products?category=Rings" },
  { name: "Necklaces", icon: Gem, link: "/products?category=Necklaces" },
  { name: "Earrings", icon: Sparkles, link: "/products?category=Earrings" },
  { name: "Bangles", icon: Crown, link: "/products?category=Bangles" },
  { name: "Sets", icon: Gift, link: "/products" },
];

// 2. MOBILE DATA (Instagram Story Photos - Updated with reliable URLs)
const mobileStories = [
  {
    id: 1,
    title: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&q=80&w=200",
    link: "/products?category=rings",
  },
  {
    id: 2,
    title: "Necklaces",
    image: "https://images.unsplash.com/photo-1599643478514-4a1102641a22?auto=format&fit=crop&q=80&w=200",
    link: "/products?category=necklaces",
  },
  {
    id: 3,
    title: "Bangles",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=200",
    link: "/products?category=bangles",
  },
  {
    id: 4,
    title: "Earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200",
    link: "/products?category=earrings",
  },
  {
    id: 5,
    title: "Bridal",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=200",
    link: "/products?category=bridal",
  },
];

export default function CategoryNav() {
  return (
    <section className="w-full bg-white border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      
      {/* ======================================================== */}
      {/* DESKTOP VIEW: Tanishq-Style Elegant Icon Bar */}
      {/* ======================================================== */}
      <div className="hidden md:flex container mx-auto max-w-6xl items-center justify-center gap-12 py-4">
        {desktopCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              href={category.link}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              {/* Ultra-thin stroke for luxury line-art feel */}
              <Icon 
                size={18} 
                strokeWidth={1.2} 
                className="text-gray-500 group-hover:text-[#C8A45D] transition-colors duration-300" 
              />
              <span className="text-[13px] tracking-[0.05em] text-gray-700 group-hover:text-[#C8A45D] transition-colors duration-300 font-medium">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MOBILE VIEW: Instagram Stories Style */}
      {/* ======================================================== */}
      <div className="md:hidden w-full">
        <div className="flex items-start gap-4 overflow-x-auto px-4 py-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mobileStories.map((story) => (
            <Link
              key={story.id}
              href={story.link}
              className="flex flex-col items-center gap-2 shrink-0 group snap-start"
            >
              {/* Gold Gradient Ring */}
              <div className="relative p-[2px] rounded-full bg-linear-to-tr from-[#C8A45D] via-[#E8DDD0] to-[#C8A45D]">
                <div className="relative w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-gray-50">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-gray-800 tracking-wide">
                {story.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
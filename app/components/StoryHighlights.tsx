"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
// Import elegant line-art icons for the desktop view
import { Sparkles, Gem, Crown, Gift, Grid2X2, Layers, CircleDot } from "lucide-react";

// 1. DESKTOP DATA: Hardcoded line-art icons (Tanishq style)
const desktopCategories = [
  { name: "All Jewellery", icon: Grid2X2, link: "/products" },
  { name: "Earrings", icon: Layers, link: "/products?category=Earrings" },
  { name: "Rings", icon: Gem, link: "/products?category=Rings" },
  { name: "Necklaces", icon: Sparkles, link: "/products?category=Necklaces" },
  { name: "Anklet", icon: CircleDot, link: "/products?category=Anklet" },
  { name: "Bangles", icon: Crown, link: "/products?category=Bangles" },
  { name: "Gifting", icon: Gift, link: "/products" },
];

interface Story {
  id: string;
  rank: number;
  title: string;
  image_url: string;
  target_link: string;
}

export default function StoryHighlights() {
  const [stories, setStories] = useState<Story[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);

  // Fetch the uploaded photos from the database (for Mobile view)
  useEffect(() => {
    fetch("/api/public/story-highlights")
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(err => console.error(err));
  }, []);

  const handleHighlightClick = (id: string) => {
    if (!viewed.includes(id)) {
      setViewed([...viewed, id]);
    }
  };

  return (
    <section className="w-full bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-b border-gray-100">
      
      {/* ========================================================= */}
      {/* DESKTOP VIEW: Clean icon navigation bar     */}
      {/* ========================================================= */}
      <div className="hidden md:flex container mx-auto max-w-7xl items-center justify-center gap-8 py-1">
        {desktopCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              href={category.link}
              className="flex items-center gap-2 group cursor-pointer px-2 py-1"
            >
              {/* strokeWidth={1.2} makes it look like expensive, delicate line art */}
              <Icon 
                size={18} 
                strokeWidth={1.2} 
                className="text-gray-500 group-hover:text-[#C8A45D] transition-colors duration-300" 
              />
              <span className="text-[14px] text-gray-700 group-hover:text-[#C8A45D] transition-colors duration-300 whitespace-nowrap">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* MOBILE VIEW: Dynamic Instagram-style Photo Stories        */}
      {/* ========================================================= */}
      {stories.length > 0 && (
        <div className="md:hidden w-full pt-4 pb-2">
          <div className="flex items-start gap-4 overflow-x-auto px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {stories.map((story) => {
              const isViewed = viewed.includes(story.id);
              
              return (
                <Link
                  key={story.id}
                  href={story.target_link}
                  onClick={() => handleHighlightClick(story.id)}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group snap-start"
                >
                  <div 
                    className={`relative rounded-full transition-all duration-300 ${
                      isViewed 
                        ? "p-[2px] bg-gray-200" 
                        : "p-[2px] bg-gradient-to-tr from-[#C8A45D] via-[#E8DDD0] to-[#C8A45D]"
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-[#FDFBF7] shadow-sm">
                      <img
                        src={story.image_url}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        draggable={false}
                      />
                    </div>
                  </div>

                  <span 
                    className={`text-[11px] tracking-wide transition-colors ${
                      isViewed ? "text-gray-500" : "text-[#1A0A05]"
                    }`}
                  >
                    {story.title}
                  </span>
                </Link>
              );
            })}
            
          </div>
        </div>
      )}

    </section>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";

export default function GoldRateBanner() {
  const [rate, setRate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("/api/public/gold-rate", { next: { revalidate: 60 } });
        const data = await res.json();
        setRate(data.rate);
      } catch (err) {
        console.error("Failed to fetch gold rate");
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  if (loading) return <div className="h-10 w-full bg-[#C8A45D]" />; // Skeleton

  return (
    // RICH GOLD GRADIENT BACKGROUND
    <div className="w-full bg-gradient-to-r from-[#C8A45D] via-[#D4B886] to-[#C8A45D] border-b border-[#B08D55] relative z-40 shadow-sm cursor-default group overflow-hidden transition-all duration-500 hover:shadow-md">
      
      {/* Subtle Shine Effect on Hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />
      
      <div className="container mx-auto h-10 flex items-center justify-center gap-3 md:gap-8 px-4 text-sm relative z-10">
        
        {/* Animated Sparkle Icon */}
        <Sparkles 
          size={16} 
          className="text-[#5E4B4B] group-hover:rotate-12 transition-transform duration-500 hidden md:block" 
          fill="currentColor"
        />

        {/* The Content */}
        <div className="flex items-center gap-3">
          
          <span className="text-[#5E4B4B] font-bold tracking-widest uppercase text-[10px] md:text-xs opacity-90 group-hover:opacity-100 transition-opacity">
            Today's Gold Rate (22K)
          </span>

          <div className="w-px h-4 bg-[#8C7B7B]/40" />

          {/* Price - Scales on Hover */}
          {rate && (
            <div className="flex items-center gap-1.5 transform group-hover:scale-105 transition-transform duration-300 origin-left">
               <span className="font-serif text-[#2A0A0A] font-extrabold text-base md:text-lg tracking-wide drop-shadow-sm">
                 ₹{Number(rate).toLocaleString('en-IN')}
               </span>
               <span className="text-[10px] text-[#5E4B4B] font-bold uppercase mt-1">/ gm</span>
               
               {/* Tiny Up Arrow */}
               <TrendingUp size={12} className="text-[#2A0A0A] ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-1" />
            </div>
          )}
        </div>

        {/* Animated Sparkle Icon (Right) */}
        <Sparkles 
          size={16} 
          className="text-[#5E4B4B] group-hover:-rotate-12 transition-transform duration-500 hidden md:block" 
          fill="currentColor"
        />

      </div>
    </div>
  );
}
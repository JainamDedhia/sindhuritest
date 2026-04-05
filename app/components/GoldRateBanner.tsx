"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Clock } from "lucide-react";

export default function GoldRateBanner() {
  const [rate, setRate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("/api/public/gold-rate", { next: { revalidate: 60 } });
        const data = await res.json();
        
        setRate(data.rate);
        
        if (data.updatedAt) {
          const formattedTime = new Date(data.updatedAt).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          setTime(formattedTime);
        }
        
      } catch (err) {
        console.error("Failed to fetch gold rate");
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  // Reverted Skeleton height back to the sleek height
  if (loading) return <div className="h-10 md:h-12 w-full bg-[#C8A45D]" />; 

  return (
    // RICH GOLD GRADIENT BACKGROUND
    <div className="w-full bg-linear-to-r from-[#C8A45D] via-[#D4B886] to-[#C8A45D] border-b border-[#B08D55] relative z-40 shadow-sm cursor-default group overflow-hidden transition-all duration-500 hover:shadow-md">
      
      {/* Subtle Shine Effect on Hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />
      
      {/* Back to a sleeker height (h-10 mobile, h-12 desktop) */}
      <div className="container mx-auto h-12 md:h-14 flex items-center justify-center gap-2 md:gap-6 px-2 text-sm relative z-10 w-full overflow-x-auto no-scrollbar">
        
        {/* Animated Sparkle Icon (Left) */}
        <Sparkles 
          size={16} 
          className="text-[#5E4B4B] group-hover:rotate-12 transition-transform duration-500 hidden md:block shrink-0" 
          fill="currentColor"
        />

        {/* ================= THE 3-PART CONTENT ================= */}
        <div className="flex items-center gap-2 md:gap-6 whitespace-nowrap">
          
          {/* PART 1: Label */}
          <span className="text-[#5E4B4B] font-bold tracking-widest uppercase text-[10px] md:text-xs opacity-90 group-hover:opacity-100 transition-opacity">
            Gold Rate (22K)
          </span>

          {/* Divider 1 */}
          <div className="w-px h-4 md:h-5 bg-[#8C7B7B]/40" />

          {/* PART 2: Price */}
          {rate && (
            <div className="flex items-center gap-1 transform group-hover:scale-105 transition-transform duration-300">
               <span className="font-serif text-[#2A0A0A] font-extrabold text-base md:text-xl tracking-wide drop-shadow-sm leading-none">
                 ₹{Number(rate).toLocaleString('en-IN')}
               </span>
               <span className="text-[9px] md:text-[10px] text-[#5E4B4B] font-bold uppercase mt-0.5">/ gm</span>
               <TrendingUp size={14} className="text-[#2A0A0A] ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />
            </div>
          )}

          {/* Divider 2 (Only shows if time exists) */}
          {time && (
            <div className="w-px h-4 md:h-5 bg-[#8C7B7B]/40" />
          )}

          {/* PART 3: Time */}
          {time && (
            <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] text-[#5E4B4B]/90 font-semibold tracking-widest uppercase">
              <Clock size={12} className="shrink-0 text-[#2A0A0A]" />
              <span>Updated: {time}</span>
            </div>
          )}

        </div>

        {/* Animated Sparkle Icon (Right) */}
        <Sparkles 
          size={16} 
          className="text-[#5E4B4B] group-hover:-rotate-12 transition-transform duration-500 hidden md:block shrink-0" 
          fill="currentColor"
        />

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function GoldRateBanner() {
  const [rate, setRate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("/api/admin/settings", { next: { revalidate: 60 } });
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

  // Loading state: Render a subtle skeleton or nothing to prevent layout shift
  if (loading) return <div className="w-full h-10 bg-neutral-950" />;

  return (
    // changed to Neutral-950 (Rich Black) for that Premium Look
    <div className="w-full bg-neutral-950 border-b border-white/5 text-white relative z-40">
      
      <div className="container mx-auto h-10 flex items-center justify-between px-4 md:px-6">
        
        {/* LEFT: Live Indicator (Clean Red Dot) */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
            Live Market
          </span>
        </div>

        {/* CENTER: The Rate (Hero) */}
        {rate && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-baseline gap-2"
          >
            <span className="hidden md:inline text-xs text-gray-500 font-medium tracking-wide">
              Standard Gold (22K):
            </span>
            <span className="text-sm md:text-base font-serif text-[var(--color-gold-primary)] font-semibold tracking-wide">
              ₹{Number(rate).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-gray-600">/gm</span>
            
            {/* Subtle Up Arrow */}
            <TrendingUp size={12} className="text-green-500 ml-1 mb-0.5" />
          </motion.div>
        )}

        {/* RIGHT: Timestamp (Minimalist) */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-gray-600 font-medium">
          <Clock size={10} />
          <span>Updated Today</span>
        </div>

      </div>
    </div>
  );
}
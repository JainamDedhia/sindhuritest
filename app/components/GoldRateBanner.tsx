"use client";

import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";

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

  if (loading) return null; // Don't show anything while loading to avoid layout shift

  return (
    <div className="w-full bg-[var(--color-gold-primary)] text-white py-4 px-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between text-xs font-medium md:text-sm">
        
        {/* LEFT: LIVE INDICATOR */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="uppercase tracking-widest opacity-90">Live Rates</span>
        </div>

        {/* CENTER: THE RATE */}
        <div className="flex items-center gap-2">
          <span>Standard Gold (22K):</span>
          <span className="font-bold text-white text-base">
            ₹{Number(rate).toLocaleString('en-IN')}
            <span className="text-[10px] font-normal opacity-80 ml-1">/gm</span>
          </span>
          <TrendingUp size={14} className="opacity-80" />
        </div>

        {/* RIGHT: TIMESTAMP (Optional) */}
        <div className="hidden md:block opacity-75 text-[10px]">
          Updated: Today
        </div>

      </div>
    </div>
  );
}
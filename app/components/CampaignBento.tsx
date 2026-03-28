"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import OptimizedImage from "./OptimizedImage"; 

export default function CampaignBento() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/public/CampaignBento")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  if (items.length === 0) return null;

  const bgItem = items.find(i => i.rank === 0);
  const mainCard = items.find(i => i.rank === 1);
  const topRightCard = items.find(i => i.rank === 2);
  const bottomRightCard = items.find(i => i.rank === 3);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden flex items-center min-h-[80vh]">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {bgItem?.image_url && (
          <OptimizedImage 
            src={bgItem.image_url} 
            alt="Campaign Background" 
            width={1920} height={1080}
            priority={true} 
            className="w-full h-full object-cover" 
          />
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="container mx-auto px-5 relative z-10 w-full">
        
        {/* HEADER */}
        <div className="max-w-xl mb-12 text-left md:text-center md:mx-auto">
          <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C8A45D] mb-3">
            <Sparkles size={12} /> The Royal Edit
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight drop-shadow-lg">
            Heritage Collection
          </h2>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          
          {/* Main Card (Left) */}
          {mainCard && (
            <Link href={mainCard.target_link || "#"} className="group relative md:col-span-2 aspect-[4/5] md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-[#C8A45D]/50">
              <div className="absolute inset-4 md:inset-6 rounded-xl overflow-hidden">
                <OptimizedImage 
                  src={mainCard.image_url} alt={mainCard.title || "Featured Campaign"} 
                  width={800} height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10">
                  <span className="text-[10px] text-[#C8A45D] font-bold uppercase tracking-widest block mb-2">Featured</span>
                  <h3 className="text-3xl md:text-5xl font-serif text-white">{mainCard.title}</h3>
                </div>
              </div>
            </Link>
          )}

          {/* Side Cards (Right) */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
            {topRightCard && (
              <Link href={topRightCard.target_link || "#"} className="group relative aspect-square md:aspect-auto md:h-[238px] rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md shadow-xl transition-all duration-500 hover:border-[#C8A45D]/50 p-3 md:p-4">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <OptimizedImage 
                    src={topRightCard.image_url} alt={topRightCard.title || "Collection Item"} 
                    width={400} height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <h3 className="text-xl md:text-2xl font-serif text-white">{topRightCard.title}</h3>
                  </div>
                </div>
              </Link>
            )}

            {bottomRightCard && (
              <Link href={bottomRightCard.target_link || "#"} className="group relative aspect-square md:aspect-auto md:h-[238px] rounded-2xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md shadow-xl transition-all duration-500 hover:border-[#C8A45D]/50 p-3 md:p-4">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <OptimizedImage 
                    src={bottomRightCard.image_url} alt={bottomRightCard.title || "Collection Item"} 
                    width={400} height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <h3 className="text-xl md:text-2xl font-serif text-white">{bottomRightCard.title}</h3>
                  </div>
                </div>
              </Link>
            )}

          </div>
            <div className="text-gray-400 block w-full text-center mt-4 text-sm md:text-base font-medium leading-relaxed tracking-wide ">Finer Detailing and Best Finishing, har Piece mein best quality and best work.</div>
        </div>
      </div>
    </section>
  );
}
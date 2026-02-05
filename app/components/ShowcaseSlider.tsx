"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ShowcaseItem {
  id: string;
  image_url: string;
  title?: string;
  link?: string;
}

// Fallback data
const MOCK_DATA: ShowcaseItem[] = [
  { id: "1", image_url: "/", title: "Office Look", link: "/products" },
  { id: "2", image_url: "/", title: "Modern Party", link: "/products" },
  { id: "3", image_url: "/", title: "Wedding Guest", link: "/products" },
  { id: "4", image_url: "/", title: "Daily Wear", link: "/products" },
  { id: "5", image_url: "/", title: "Antique Gold", link: "/products" },
];

export default function ShowcaseSlider() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/showcase", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // Ensure we have at least 3 items for the carousel to work
          if (Array.isArray(data) && data.length > 0) {
            setItems(data.length < 3 ? [...data, ...data, ...data] : data); 
          } else {
            setItems(MOCK_DATA);
          }
        } else setItems(MOCK_DATA);
      } catch (err) {
        setItems(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Determine the position of a card relative to the center
  const getCardStyle = (index: number) => {
    const total = items.length;
    // Calculate shortest distance in a loop (e.g., if total is 5, distance between 4 and 0 is 1)
    let dist = (index - currentIndex + total) % total;
    if (dist > total / 2) dist -= total;

    // CENTER CARD
    if (dist === 0) {
      return {
        x: "0%",
        scale: 1,
        zIndex: 20,
        opacity: 1,
        filter: "blur(0px)",
      };
    }
    
    // LEFT CARD (-1)
    if (dist === -1) {
      return {
        x: "-50%", // Adjust spread here
        scale: 0.85,
        zIndex: 10,
        opacity: 0.6,
        filter: "blur(0px)", // Optional: blur(2px) for depth
      };
    }

    // RIGHT CARD (+1)
    if (dist === 1) {
      return {
        x: "50%", // Adjust spread here
        scale: 0.85,
        zIndex: 10,
        opacity: 0.6,
        filter: "blur(0px)",
      };
    }

    // HIDDEN CARDS (Behind)
    return {
      x: dist < 0 ? "-100%" : "100%",
      scale: 0.7,
      zIndex: 0,
      opacity: 0.6,
      filter: "blur(5px)",
    };
  };

  if (loading) return (
    <div className="w-full h-[600px] flex items-center justify-center bg-[#FDFBF7]">
       <div className="animate-pulse w-64 h-80 bg-gray-200 rounded-2xl"></div>
    </div>
  );
  
  if (items.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-[#FDFBF7]">
      
      {/* 1. BACKGROUND IMAGE & TEXTURE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Mandala/Floral Pattern */}
        <img 
          src="/assets/pattern.PNG" 
          alt="Pattern" 
          className="w-full h-full object-cover opacity-[0.3] mix-blend-multiply"
        />
        {/* Vignette to focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,_#FDFBF7_90%)]" />
      </div>

      {/* 2. HEADER */}
      <div className="container mx-auto px-4 mb-16 text-center relative z-10">
        <span className="text-[var(--color-gold-primary)] text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
          Curated For You
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-[#4A3F35] mt-3 mb-4">
          Choose Your Look
        </h2>
        <div className="w-20 h-1 bg-[var(--color-gold-primary)] mx-auto rounded-full opacity-60" />
      </div>

      {/* 3. CAROUSEL CONTAINER */}
      <div className="relative flex items-center justify-center h-[450px] md:h-[500px] w-full max-w-[1400px] mx-auto z-10">
        
        {/* NAV BUTTONS */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 md:left-20 z-50 p-4 rounded-full bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-[var(--color-gold-primary)] hover:text-white transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 md:right-20 z-50 p-4 rounded-full bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-[var(--color-gold-primary)] hover:text-white transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* CAROUSEL TRACK */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((item, index) => {
              const style = getCardStyle(index);
              
              // Only render cards that are visible or transitioning
              if (style.opacity === 0) return null;

              return (
                <motion.div
                  key={item.id} // Ensure Key is unique but stable
                  initial={false} // Prevent initial animation glitch
                  animate={style}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }}
                  className={`
                    absolute 
                    w-[280px] md:w-[340px] aspect-[3/4] 
                    rounded-2xl overflow-hidden shadow-2xl bg-white
                    cursor-pointer
                  `}
                  style={{
                    transformOrigin: "center center",
                  }}
                  onClick={() => {
                     // Click side cards to navigate
                     let dist = (index - currentIndex + items.length) % items.length;
                     if (dist > items.length / 2) dist -= items.length;
                     if(dist === -1) prevSlide();
                     if(dist === 1) nextSlide();
                  }}
                >
                  {/* Image */}
                  <img 
                    src={item.image_url} 
                    alt={item.title || "Look"} 
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  
                  {/* Overlay (Only on Center Card) */}
                  {style.scale === 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 text-center"
                    >
                      <h3 className="text-2xl font-serif text-white mb-2">{item.title}</h3>
                      {item.link && (
                        <Link 
                          href={item.link} 
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-gold-primary)] hover:text-white transition-colors"
                        >
                          Shop This Look <ArrowRight size={14} />
                        </Link>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE DOTS */}
      <div className="flex justify-center gap-2 mt-8 md:hidden">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-[var(--color-gold-primary)]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
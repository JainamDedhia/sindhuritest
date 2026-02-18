"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Pause, Play } from "lucide-react";
import MobileStackCarousel from "./MobileStackCarousel";
import { getHeroBanner, getMobileBanner } from '@/lib/imageOptimizer';

type Banner = {
  id: string;
  image_url: string;
  device_type: "desktop" | "mobile";
  title?: string;
  subtitle?: string;
};

export default function HeroSection() {
  const [desktopBanners, setDesktopBanners] = useState<Banner[]>([]);
  const [mobileBanners, setMobileBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        // 🔥 Pre-optimize all banner URLs at fetch time
        const processed = data.map((b: Banner) => ({
          ...b,
          image_url: b.device_type === "desktop"
            ? getHeroBanner(b.image_url)
            : getMobileBanner(b.image_url),
        }));
        setDesktopBanners(processed.filter((b) => b.device_type === "desktop"));
        setMobileBanners(processed.filter((b) => b.device_type === "mobile"));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-[500px] w-full bg-gray-50 animate-pulse" />;

  return (
    <section className="w-full bg-white relative group">
      
      {/* ================= DESKTOP (Luxury Parallax) ================= */}
      <div className="hidden md:block h-[550px] relative overflow-hidden">
        {desktopBanners.length > 0 ? (
          <LuxurySlider banners={desktopBanners} />
        ) : (
          <div className="h-full flex items-center justify-center bg-[#FDFBF7]">
            <h1 className="font-serif text-4xl text-gray-800">Sinduri Jewellers</h1>
          </div>
        )}
      </div>

      {/* ================= MOBILE (Stack Carousel) ================= */}
      <div className="block md:hidden h-[60vh] min-h-[500px] relative overflow-hidden bg-[#FAFAFA]">
        {mobileBanners.length > 0 ? (
          <MobileStackCarousel banners={mobileBanners} />
        ) : (
          <div className="h-full flex items-center justify-center bg-[#FDFBF7]">
            <span className="text-gray-400">Sinduri</span>
          </div>
        )}
      </div>

    </section>
  );
}

function LuxurySlider({ banners }: { banners: Banner[] }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // 🔥 Track which images have been preloaded
  const [preloaded, setPreloaded] = useState<Set<number>>(new Set([0]));

  const imageIndex = Math.abs(page % banners.length);
  const currentBanner = banners[imageIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [page, isAutoPlaying, paginate]);

  // 🔥 Preload next image when current slide changes
  useEffect(() => {
    const nextIndex = (imageIndex + 1) % banners.length;
    if (!preloaded.has(nextIndex)) {
      const img = new Image();
      img.src = banners[nextIndex].image_url;
      img.onload = () => setPreloaded(prev => new Set([...prev, nextIndex]));
    }
  }, [imageIndex, banners, preloaded]);

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 1 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? "100%" : "-100%", opacity: 1 }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            src={currentBanner.image_url}
            alt={currentBanner.title || "Banner"}
            className="w-full h-full object-cover"
            // 🔥 First banner loads eagerly, rest lazily
            loading={imageIndex === 0 ? "eager" : "lazy"}
            fetchPriority={imageIndex === 0 ? "high" : "auto"}
            decoding="async"
            draggable={false}
          />
          {(currentBanner.title || currentBanner.subtitle) && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center text-white z-10 px-6">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-medium tracking-[0.3em] uppercase mb-3"
                >
                  {currentBanner.subtitle}
                </motion.p>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl font-serif tracking-wide"
                >
                  {currentBanner.title}
                </motion.h2>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const newDir = i > imageIndex ? 1 : -1;
              setPage([page + (i - imageIndex), newDir]);
            }}
            className="group relative py-2"
          >
            <div className={`h-1.5 rounded-full transition-all duration-500 ease-out shadow-sm ${i === imageIndex ? "w-8 bg-white" : "w-1.5 bg-white/40 group-hover:bg-white/70"}`} />
          </button>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-6 right-8 z-20 hidden md:flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
          <button onClick={() => paginate(-1)} className="p-2 rounded-full text-white/80 hover:bg-white hover:text-black transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="p-2 rounded-full text-white/80 hover:bg-white hover:text-black transition-all">
            {isAutoPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>
          <button onClick={() => paginate(1)} className="p-2 rounded-full text-white/80 hover:bg-white hover:text-black transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
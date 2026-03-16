'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Added these icons

interface Banner {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
}

function MobileStackCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play timer
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [banners?.length]);

  // Button Handlers
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full pb-2">
      
      {/* Container with the requested 3.75/5 mobile aspect ratio */}
      <div className="relative flex items-center justify-center aspect-[3.75/5] md:aspect-auto md:h-[450px] lg:h-[550px] w-full overflow-hidden bg-[#1A0A05] group">
        
        {banners.map((banner, i) => {
          const offset = (i - currentIndex + banners.length) % banners.length;
          const adjustedOffset = offset > banners.length / 2 ? offset - banners.length : offset;

          // Only render the current card and the ones immediately to the left/right
          if (Math.abs(adjustedOffset) > 1) return null;

          const isCenterCard = adjustedOffset === 0;
          const baseX = `${adjustedOffset * 100}%`; 

          return (
            <motion.div
              key={banner.id}
              style={{ zIndex: isCenterCard ? 10 : 0 }}
              initial={false}
              animate={{ x: baseX }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute w-full h-full bg-black shadow-sm will-change-transform"
            >
              <div className="relative w-full h-full select-none overflow-hidden bg-black">
                
                {/* Cinematic Blur Background */}
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center blur-xl opacity-60 scale-110 pointer-events-none transition-all duration-700"
                  style={{ backgroundImage: `url(${banner.image_url})` }}
                />

                {/* Un-cropped foreground image */}
                <img
                  src={banner.image_url}
                  alt={banner.title || "Banner"}
                  className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                  draggable={false}
                />
                
                {(banner.title || banner.subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white z-20 pointer-events-none pt-20">
                    <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
                      <h3 className="font-serif text-2xl md:text-4xl font-medium tracking-wide leading-tight drop-shadow-lg">
                          {banner.title}
                      </h3>
                      {banner.subtitle && (
                        <p className="text-sm md:text-base opacity-90 font-light mt-2 drop-shadow-md">
                            {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Floating Navigation Buttons (Only show if there are multiple banners) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-[#C8A45D] hover:border-[#C8A45D] transition-all shadow-lg opacity-80 hover:opacity-100"
              aria-label="Previous banner"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-[#C8A45D] hover:border-[#C8A45D] transition-all shadow-lg opacity-80 hover:opacity-100"
              aria-label="Next banner"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? 'w-6 bg-[#C8A45D]' 
                : 'w-2 bg-gray-200 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export default MobileStackCarousel;
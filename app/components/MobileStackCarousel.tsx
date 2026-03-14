'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';

interface Banner {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
}

function MobileStackCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  
  const SWIPE_THRESHOLD = 50;
  const SWIPE_VELOCITY_THRESHOLD = 0.4;

  const dragRotation = useTransform(dragX, [-150, 0, 150], [10, 0, -10]);

  useEffect(() => {
    if (isDragging || !banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000); // 🚀 FASTER: Changed from 4000ms to 3000ms
    return () => clearInterval(interval);
  }, [isDragging, banners?.length]);

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) > SWIPE_VELOCITY_THRESHOLD) {
      if (velocity > 0) setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      else setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (Math.abs(offset) > SWIPE_THRESHOLD) {
      if (offset > 0) setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      else setCurrentIndex((prev) => (prev + 1) % banners.length);
    }

    // 🚀 FASTER SNAP: Increased stiffness from 500 to 600
    animate(dragX, 0, { type: 'spring', stiffness: 800, damping: 25 });
  };

  if (!banners || banners.length === 0) return null;

  return (
    // Kept py-6 so margins don't expand
    <div className="flex flex-col items-center justify-center h-full w-full py-6">
      {/* Set explicit height to hold larger cards without pushing layout */}
      <div className="relative flex items-center justify-center h-[420px] sm:h-[480px] w-full">
        {banners.map((banner, i) => {
          const offset = (i - currentIndex + banners.length) % banners.length;
          const adjustedOffset = offset > banners.length / 2 ? offset - banners.length : offset;

          if (Math.abs(adjustedOffset) > 2) return null;

          // Spread them slightly more since the cards are bigger
          const baseX = adjustedOffset * 18; 
          const baseRotate = adjustedOffset * 4;
          const scale = Math.max(0.85, 1 - Math.abs(adjustedOffset) * 0.08);
          const zIndex = 10 - Math.abs(adjustedOffset);
          const opacity = Math.max(0.6, 1 - Math.abs(adjustedOffset) * 0.15);
          const isCenterCard = adjustedOffset === 0;

          return (
            <motion.div
              key={banner.id}
              drag={isCenterCard ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{
                x: isCenterCard ? dragX : baseX,
                rotate: isCenterCard ? dragRotation : baseRotate,
                scale,
                zIndex,
                opacity,
                transformOrigin: 'bottom center',
              }}
              animate={!isDragging ? { x: baseX, rotate: baseRotate, scale, opacity } : undefined}
              // 🚀 FASTER ANIMATION: Increased stiffness from 300 to 450
              transition={{ type: 'spring', stiffness: 650, damping: 25 }}
              
              // 📏 BIGGER CARDS: Increased width from 70vw to 85vw and max-w from 70 (~280px) to 340px
              className="absolute w-[85vw] max-w-85 aspect-[2.5/4] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-grab active:cursor-grabbing will-change-transform"
            >
              <div className="relative w-full h-full select-none">
                <img
                  src={banner.image_url}
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                
                {(banner.title || banner.subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-5 text-white z-20 pointer-events-none pt-12">
                    <h3 className="font-serif text-xl font-medium tracking-wide leading-tight">
                        {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-sm opacity-90 font-light mt-1">
                          {banner.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Overlay Gradient for non-active cards */}
              {!isCenterCard && <div className="absolute inset-0 bg-white/10 z-30 pointer-events-none" />}
            </motion.div>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 mt-6">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? 'w-5 bg-[#C8A45D]' 
                : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export default MobileStackCarousel;
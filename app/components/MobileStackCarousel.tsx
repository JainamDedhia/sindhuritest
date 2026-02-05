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
    }, 4000);
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

    animate(dragX, 0, { type: 'spring', stiffness: 500, damping: 30 });
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-6">
      <div className="relative flex items-center justify-center h-[450px] w-full">
        {banners.map((banner, i) => {
          const offset = (i - currentIndex + banners.length) % banners.length;
          const adjustedOffset = offset > banners.length / 2 ? offset - banners.length : offset;

          if (Math.abs(adjustedOffset) > 2) return null;

          const baseX = adjustedOffset * 15;
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
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute w-[70vw] max-w-[280px] aspect-[3/4] rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-xl cursor-grab active:cursor-grabbing will-change-transform"
            >
              <div className="relative w-full h-full select-none">
                <img
                  src={banner.image_url}
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                
                {(banner.title || banner.subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white z-20 pointer-events-none pt-12">
                    <h3 className="font-serif text-lg font-medium tracking-wide leading-tight">
                        {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-xs opacity-90 font-light mt-1">
                          {banner.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Overlay Gradient for non-active cards */}
              {!isCenterCard && <div className="absolute inset-0 bg-white/10 z-30" />}
            </motion.div>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? 'w-5 bg-[var(--color-gold-primary)]' 
                : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export default MobileStackCarousel;
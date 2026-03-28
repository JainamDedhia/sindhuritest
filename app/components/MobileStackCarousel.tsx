'use client';

import { useEffect, useState } from 'react';

interface Banner {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
}

function MobileStackCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // FAST Auto-play timer (2.5 seconds instead of 4 seconds)
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 1000); 
    return () => clearInterval(interval);
  }, [banners?.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full pb-2">
      
      {/* Container with the requested 4.75/7 mobile aspect ratio */}
      <div className="relative flex items-center justify-center aspect-[4.75/7] md:aspect-auto md:h-[450px] lg:h-[550px] w-full overflow-hidden bg-[#1A0A05]">
        
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            // Instant flick/cut. No transition delays.
            className={`absolute inset-0 w-full h-full ${
              i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Single stretched image, no blur background */}
            <img
              src={banner.image_url}
              alt={banner.title || "Banner"}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {(banner.title || banner.subtitle) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white pt-20">
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
        ))}
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
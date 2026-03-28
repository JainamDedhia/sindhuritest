"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Mock Data with Initials for the Avatar
const REVIEWS = [
  {
    id: 1,
    name: "Sanjay Jadhav",
    initials: "SJ",
    location: "Aurangabad",
    rating: 4,
    text: "डिज़ाइन अच्छे हैं और कारीगरी साफ दिखती है। दाम भी ठीक लगे। बस थोड़ा समय लग गया, क्योंकि दुकान पर भीड़ ज़्यादा थी।",
  },
  {
    id: 2,
    name: "Meena Pawar",
    initials: "MP",
    location: "Nashik",
    rating: 4,
    text: "आभूषण की गुणवत्ता अच्छी है और फिनिशिंग भी साफ है। स्टाफ ने ठीक से समझाया। थोड़ा इंतज़ार करना पड़ा, बाकी अनुभव अच्छा रहा।",
  },
  {
    id: 3,
    name: "Amit Kulkarni",
    initials: "AK",
    location: "Pune",
    rating: 5,
    text: "Bought a gold chain for daily wear. Finishing is very clean and weight was exactly as told. Billing process was transparent. Felt reliable.",
  },
  {
    id: 4,
    name: "Sneha Deshmukh",
    initials: "SD",
    location: "Nagpur",
    rating: 5,
    text: "Designs are simple but very well made. Not over fancy, which I liked. Prices are also better compared to other stores I checked.",
  },
  {
    id: 5,
    name: "Rohit Patil",
    initials: "RP",
    location: "Kolhapur",
    rating: 5,
    text: "Good variety in bangles and rings. Staff explained properly about weight and making. Overall felt honest and clear.",
  },
  {
    id: 6,
    name: "Vaishali Joshi",
    initials: "VJ",
    location:"Mumbai",
    rating: 5,
    text: "I have been buying from here for a few years now. Quality has been consistent and designs don’t go out of style quickly."
  }
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive Layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 6000); 

    return () => resetTimeout();
  }, [currentIndex, itemsPerView]);

  const maxIndex = Math.max(0, REVIEWS.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="py-20 md:py-28 bg-[#FDFBF7] relative overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C8A45D] mb-3 block">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-gray-900 leading-tight">
            Client Stories
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto">
          
          <div className="overflow-hidden px-4 -mx-4 pb-12 pt-12"> {/* Top padding for floating avatar */}
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  {/* REVIEW CARD WRAPPER */}
                  <div className="relative group">
                    
                    {/* The White Card */}
                    <div className="bg-white rounded-2xl p-8 pt-16 md:px-10 md:pb-10 md:pt-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
                      
                      {/* Floating Avatar (Absolute Positioned) */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full p-1.5 bg-white shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#C8A45D] to-[#E5D3B3] flex items-center justify-center text-white font-serif text-2xl font-bold shadow-inner">
                          {review.initials}
                        </div>
                      </div>

                      {/* Review Text */}
                      <div className="relative z-10">
                        <p className="text-gray-600 font-serif text-[15px] md:text-lg leading-relaxed mb-6 italic">
                          "{review.text}"
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="w-12 h-[1px] bg-[#C8A45D]/40 mx-auto mb-6" />

                      {/* Name & Location */}
                      <h4 className="font-serif text-xl text-gray-900 font-medium mb-1">
                        {review.name}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                        {review.location}
                      </p>

                      {/* Stars */}
                      <div className="flex justify-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < review.rating
                                ? "fill-[#C8A45D] text-[#C8A45D]"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute top-1/2 -left-4 lg:-left-12 -translate-y-1/2 bg-white text-gray-800 p-4 rounded-full shadow-lg border border-gray-100 hover:scale-110 hover:border-[#C8A45D] transition-all z-20"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="hidden md:flex absolute top-1/2 -right-4 lg:-right-12 -translate-y-1/2 bg-white text-gray-800 p-4 rounded-full shadow-lg border border-gray-100 hover:scale-110 hover:border-[#C8A45D] transition-all z-20"
          >
            <ChevronRight size={20} />
          </button>

        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentIndex === idx
                  ? "w-8 bg-[#C8A45D]"
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
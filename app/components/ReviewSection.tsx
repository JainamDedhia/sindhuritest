"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Mock Data with Initials for the Avatar
const REVIEWS = [
  {
    id: 1,
    name: "Ananya Sharma",
    initials: "AS",
    location: "Mumbai",
    rating: 5,
    text: "The craftsmanship is absolutely stunning. I bought a diamond necklace for my wedding, and it exceeded all expectations. Truly timeless elegance.",
  },
  {
    id: 2,
    name: "Rahul Malhotra",
    initials: "RM",
    location: "New Delhi",
    rating: 5,
    text: "Sinduri Jewellers never disappoints. The purity of the gold and the intricacy of the designs are unmatched. Highly recommended.",
  },
  {
    id: 3,
    name: "Priya Kapoor",
    initials: "PK",
    location: "Bangalore",
    rating: 4,
    text: "Loved the contemporary designs! Ordered a ring online and the packaging was so premium and secure. Will definitely purchase again.",
  },
  {
    id: 4,
    name: "Vikram Reddy",
    initials: "VR",
    location: "Hyderabad",
    rating: 5,
    text: "Best place for antique jewelry. The detailing on the temple collection is mesmerizing. Great service and transparent pricing.",
  },
  {
    id: 5,
    name: "Sneha Gupta",
    initials: "SG",
    location: "Jaipur",
    rating: 5,
    text: "I customized a bracelet and they brought my vision to life perfectly. The finish is flawless. Thank you Sinduri!",
  },
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
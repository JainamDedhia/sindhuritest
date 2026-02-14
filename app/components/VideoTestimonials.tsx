"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Star } from "lucide-react";

// 🔥 YouTube Video Reviews
const VIDEO_REVIEWS = [
  {
    id: 1,
    customer: "Meera & Rohan",
    location: "Wedding, Udaipur",
    youtubeId: "Awki2C9V0Xk",
    quote: "The bridal set was the highlight of my look.",
  },
  {
    id: 2,
    customer: "Sanya Malhotra",
    location: "Festive Edit",
    youtubeId: "Awki2C9V0Xk", // Replace with actual video ID
    quote: "Obsessed with the detailing on these bangles!",
  },
  {
    id: 3,
    customer: "Ishita Raj",
    location: "Engagement",
    youtubeId: "Awki2C9V0Xk", // Replace with actual video ID
    quote: "Found the perfect diamond ring here.",
  },
  {
    id: 4,
    customer: "Aarav & Family",
    location: "Gifting",
    youtubeId: "Awki2C9V0Xk", // Replace with actual video ID
    quote: "The best gold purity and service in town.",
  },
];

// --- VIDEO CARD WITH AUTOPLAY & NO BRANDING ---
function VideoCard({ review }: { review: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // 🔥 AGGRESSIVE YOUTUBE EMBED PARAMETERS TO HIDE EVERYTHING
  const embedUrl = `https://www.youtube.com/embed/${review.youtubeId}?` + new URLSearchParams({
    autoplay: '1',           // Autoplay when in view
    mute: '1',               // Must be muted for autoplay to work
    loop: '1',               // Loop the video
    playlist: review.youtubeId, // Required for loop to work
    controls: '0',           // Hide controls
    showinfo: '0',           // Hide title
    modestbranding: '1',     // Minimal YouTube logo
    rel: '0',                // Don't show related videos
    fs: '0',                 // No fullscreen button
    cc_load_policy: '0',     // No captions
    iv_load_policy: '3',     // Hide annotations
    disablekb: '1',          // Disable keyboard controls
    playsinline: '1',        // Play inline on mobile
  }).toString();

  // Intersection Observer to autoplay only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.5);
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative flex-shrink-0 w-[280px] md:w-full aspect-[9/16] group cursor-pointer snap-center rounded-2xl overflow-hidden shadow-lg bg-black transform transition-transform duration-500 hover:scale-[1.02]"
    >
      
      {/* YOUTUBE IFRAME - FULLY CUSTOMIZED */}
      {isInView && (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{
            border: 'none',
            // 🔥 HIDE YOUTUBE LOGO WITH CSS
            pointerEvents: 'auto',
          }}
        />
      )}

      {/* 🔥 OVERLAY TO HIDE YOUTUBE BRANDING AT BOTTOM */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

      {/* Customer Info Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 pointer-events-none">
        <div className="flex gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className="fill-[#C8A45D] text-[#C8A45D]" />
          ))}
        </div>

        <h3 className="text-xl font-serif text-white leading-snug mb-1 drop-shadow-lg">
          {review.customer}
        </h3>
        
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-3">
          {review.location}
        </p>

        <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed">
          "{review.quote}"
        </p>
      </div>

      {/* 🔥 TOP GRADIENT TO HIDE ANY YOUTUBE UI */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
      
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function VideoTestimonials() {
  return (
    <section className="py-16 md:py-28 bg-white border-t border-gray-50 relative">
      
      {/* Header */}
      <div className="container mx-auto px-6 mb-10 text-center">
        <span className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C8A45D] mb-3">
          <Play size={10} fill="currentColor" /> Watch Their Stories
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gray-900 leading-tight">
          Client Diaries
        </h2>
      </div>

      {/* Video Grid */}
      <div className="container mx-auto px-0 md:px-6 max-w-[1400px]">
        
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible px-6 md:px-0 pb-10 snap-x snap-mandatory scrollbar-hide">
          {VIDEO_REVIEWS.map((review) => (
            <VideoCard key={review.id} review={review} />
          ))}
        </div>

      </div>
    </section>
  );
}
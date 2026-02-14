"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Star, Volume2, VolumeX } from "lucide-react";

// 🔥 UPDATED: Now using YouTube video IDs instead of local files
const VIDEO_REVIEWS = [
  {
    id: 1,
    customer: "Meera & Rohan",
    location: "Wedding, Udaipur",
    youtubeId: "Awki2C9V0Xk", // 🔥 Your video ID
    quote: "The bridal set was the highlight of my look.",
  },
  {
    id: 2,
    customer: "Sanya Malhotra",
    location: "Festive Edit",
    youtubeId: "Awki2C9V0Xk", // Replace with actual video ID when you have more
    quote: "Obsessed with the detailing on these bangles!",
  },
  {
    id: 3,
    customer: "Ishita Raj",
    location: "Engagement",
    youtubeId: "Awki2C9V0Xk", // Replace with actual video ID when you have more
    quote: "Found the perfect diamond ring here.",
  },
  {
    id: 4,
    customer: "Aarav & Family",
    location: "Gifting",
    youtubeId: "Awki2C9V0Xk", // Replace with actual video ID when you have more
    quote: "The best gold purity and service in town.",
  },
];

// --- VIDEO CARD WITH YOUTUBE EMBED ---
function VideoCard({ review }: { review: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build YouTube embed URL
  const embedUrl = `https://www.youtube.com/embed/${review.youtubeId}?autoplay=0&mute=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`;

  return (
    <div className="relative flex-shrink-0 w-[280px] md:w-full aspect-[9/16] group cursor-pointer snap-center rounded-2xl overflow-hidden shadow-md bg-gray-100 transform transition-transform duration-500">
      
      {/* YOUTUBE IFRAME */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="absolute inset-0 w-full h-full object-cover"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />

      {/* Dark Overlay - Only shows when NOT playing */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-60'}`} />

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 pointer-events-none">
        <div className="flex gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className="fill-[#C8A45D] text-[#C8A45D]" />
          ))}
        </div>

        <h3 className="text-xl font-serif text-white leading-snug mb-1 drop-shadow-md">
          {review.customer}
        </h3>
        
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-3">
          {review.location}
        </p>

        <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed opacity-100">
          "{review.quote}"
        </p>
      </div>
    </div>
  );
}

// --- MAIN PARENT COMPONENT ---
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

      {/* Video Scroll Container */}
      <div className="container mx-auto px-0 md:px-6 max-w-[1400px]">
        
        {/* Scroll Track: Enabled Snap Scrolling for Mobile */}
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible px-6 md:px-0 pb-10 snap-x snap-mandatory no-scrollbar">
          {VIDEO_REVIEWS.map((review) => (
            <VideoCard key={review.id} review={review} />
          ))}
        </div>

      </div>
    </section>
  );
}
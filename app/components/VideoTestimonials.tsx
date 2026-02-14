"use client";

import { Play, Star } from "lucide-react";

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
    youtubeId: "fvqk6-t7Kuk",
    quote: "Obsessed with the detailing on these bangles!",
  },
  {
    id: 3,
    customer: "Ishita Raj",
    location: "Engagement",
    youtubeId: "xPoHT0ZNtic",
    quote: "Found the perfect diamond ring here.",
  },
  {
    id: 4,
    customer: "Aarav & Family",
    location: "Gifting",
    youtubeId: "jTMw-ACKSJg",
    quote: "The best gold purity and service in town.",
  },
];

function VideoCard({ review }: { review: any }) {
  // 🔥 IMMEDIATE AUTOPLAY - no intersection observer needed
  const embedUrl = `https://www.youtube.com/embed/${review.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${review.youtubeId}&controls=0&modestbranding=1&rel=0&fs=0&cc_load_policy=0&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=1`;

  return (
    <div className="relative flex-shrink-0 w-[280px] md:w-full aspect-[9/16] group snap-center rounded-2xl overflow-hidden shadow-lg bg-black">
      
      {/* 🔥 YOUTUBE IFRAME - Loads immediately, no conditions */}
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full z-10"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="eager"
        style={{ 
          border: 'none', 
          pointerEvents: 'none'
        }}
        title={`Video review from ${review.customer}`}
      />

      {/* Invisible Interaction Blocker - Prevents YouTube UI from showing */}
      <div 
        className="absolute inset-0 z-20" 
        style={{ pointerEvents: 'auto', cursor: 'default' }}
      />

      {/* Visual Gradients */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/85 to-transparent z-30 pointer-events-none" />

      {/* Customer Info Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-40 pointer-events-none select-none">
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

        <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed drop-shadow">
          "{review.quote}"
        </p>
      </div>
      
    </div>
  );
}

export default function VideoTestimonials() {
  return (
    <section className="py-16 md:py-28 bg-white border-t border-gray-50 relative">
      
      <div className="container mx-auto px-6 mb-10 text-center">
        <span className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C8A45D] mb-3">
          <Play size={10} fill="currentColor" /> Watch Their Stories
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gray-900 leading-tight">
          Client Diaries
        </h2>
      </div>

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
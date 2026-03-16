"use client";

import { Play, Star, VolumeX, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

function VideoCard({ review, isFirst }: { review: any; isFirst: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null); // Reference to send commands to YouTube
  
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(isFirst); // First video starts playing automatically

  // Load iframe ONLY when it scrolls into view to save page performance
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Use YouTube's secret postMessage API to Play/Pause instantly
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: nextState ? "playVideo" : "pauseVideo", args: [] }),
      "*"
    );
  };

  // Use YouTube's secret postMessage API to Mute/Unmute instantly
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isMuted;
    setIsMuted(nextState);
    
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: nextState ? "mute" : "unMute", args: [] }),
      "*"
    );
  };

  // The URL is static now! We added "enablejsapi=1" so we can control it via code.
  const embedUrl = `https://www.youtube-nocookie.com/embed/${review.youtubeId}?enablejsapi=1&autoplay=${isFirst ? 1 : 0}&mute=1&controls=0&modestbranding=1&rel=0&fs=0&cc_load_policy=0&iv_load_policy=3&disablekb=1&playsinline=1&loop=1&playlist=${review.youtubeId}`;

  return (
    <div
      ref={containerRef}
      className="relative shrink-0 w-70 md:w-full aspect-9/16 group snap-center rounded-2xl overflow-hidden shadow-lg bg-[#1A0A05] cursor-pointer"
      onClick={togglePlay} // Clicking anywhere on the card toggles Play/Pause
    >
      
      {/* The YouTube Video */}
      {isVisible && (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="absolute inset-0 w-full h-full z-10 scale-[1.35] md:scale-[1.1]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          style={{
            border: "none",
            pointerEvents: "none", // This forces all clicks to hit our container instead of the iframe
          }}
          title={`Video review from ${review.customer}`}
        />
      )}

      {/* Visual Gradients for text readability */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/80 via-black/30 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-black/90 via-black/60 to-transparent z-20 pointer-events-none" />

      {/* Huge Center Play Button (Only shows when Paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-300 pointer-events-none">
          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl scale-100 group-hover:scale-110 transition-transform">
            <Play className="fill-white text-white ml-1" size={24} />
          </div>
        </div>
      )}

      {/* Mute/Unmute Toggle Button (Top Right) */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-40 h-9 w-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/80 transition-colors shadow-lg"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

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

        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A45D] mb-3">
          {review.location}
        </p>

        <p className="text-sm text-white/90 font-medium line-clamp-3 leading-relaxed drop-shadow">
          "{review.quote}"
        </p>
      </div>
    </div>
  );
}

export default function VideoTestimonials() {
  return (
    <section className="py-16 md:py-24 bg-[#FDFBF7] border-y border-[#E8DDD0] relative overflow-hidden">
      
      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
        <span className="flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C8A45D] mb-3">
          <Play size={10} fill="currentColor" /> Watch Their Stories
        </span>
        <h2 className="font-serif text-4xl md:text-5xl text-[#1A0A05] leading-tight">
          Client Diaries
        </h2>
      </div>

      <div className="container mx-auto px-0 md:px-6 max-w-350 relative z-10">
        {/* Hide scrollbar completely but allow smooth snapping */}
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible px-6 md:px-0 pb-10 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {VIDEO_REVIEWS.map((review, index) => (
            <VideoCard 
              key={review.id} 
              review={review} 
              isFirst={index === 0} // Only the first video gets auto-played
            />
          ))}
        </div>
      </div>
    </section>
  );
}
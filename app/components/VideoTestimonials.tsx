"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Star, Quote, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

const VIDEO_REVIEWS = [
  {
    id: 1,
    customer: "Meera & Rohan",
    location: "Wedding, Udaipur",
    videoSrc: "/videos/review-video.mp4",
    quote: "The bridal set was the highlight of my look.",
  },
  {
    id: 2,
    customer: "Sanya Malhotra",
    location: "Festive Edit",
    videoSrc: "/videos/review-video2.mp4",
    quote: "Obsessed with the detailing on these bangles!",
  },
  {
    id: 3,
    customer: "Ishita Raj",
    location: "Engagement",
    videoSrc: "/videos/review-video3.mp4",
    quote: "Found the perfect diamond ring here.",
  },
  {
    id: 4,
    customer: "Aarav & Family",
    location: "Gifting",
    videoSrc: "/videos/review-video4.mp4",
    quote: "The best gold purity and service in town.",
  },
];

// --- SUB-COMPONENT: HANDLES INDIVIDUAL VIDEO LOGIC ---
function VideoCard({ review }: { review: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 1. Setup Intersection Observer (Plays video only when 60% visible)
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // Play safely
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Auto-play was prevented (browser restriction) or interrupted
              setIsPlaying(false);
            });
          }
          setIsPlaying(true);
        } else {
          // Pause immediately when out of view to save resources
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 } // Trigger when 60% of the card is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative flex-shrink-0 w-[280px] md:w-full aspect-[9/16] group cursor-pointer snap-center rounded-2xl overflow-hidden shadow-md bg-gray-100 transform transition-transform duration-500">
      
      {/* VIDEO ELEMENT */}
      <video
        ref={videoRef}
        src={review.videoSrc}
        className="absolute inset-0 w-full h-full object-cover"
        muted={true} // Start muted
        loop
        playsInline // Critical for iOS
        preload="metadata" // Save data by not loading full video instantly
      />

      {/* Dark Overlay (Fades out slightly on play) */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isPlaying ? 'opacity-40' : 'opacity-60'}`} />

      {/* --- CONTROLS --- */}
      
      {/* 1. Mute Toggle */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 z-30 p-2.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/50 active:scale-90 transition-all"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* 2. Play Status Icon (Visible only when paused/buffering) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl">
            <Play size={22} fill="currentColor" className="ml-1" />
          </div>
        </div>
      )}

      {/* 3. Bottom Info */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20">
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
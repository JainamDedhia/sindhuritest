"use client";

/**
 * OptimizedImage.tsx
 * A drop-in replacement for <img> with:
 * - Blur-up placeholder (loads tiny blurry version first)
 * - Lazy loading via Intersection Observer
 * - Automatic Cloudinary URL optimization
 * - In-memory URL cache to avoid re-computing transforms
 * - Error fallback
 */

import { useState, useEffect, useRef, memo } from "react";
import {
  optimizeCloudinaryUrl,
  getBlurPlaceholder,
  getResponsiveSrcSet,
} from "@/lib/imageOptimizer";

// ============================================================
// IN-MEMORY URL CACHE — prevents redundant URL transforms
// ============================================================
const urlCache = new Map<string, string>();

function getCachedUrl(key: string, fn: () => string): string {
  if (urlCache.has(key)) return urlCache.get(key)!;
  const result = fn();
  urlCache.set(key, result);
  return result;
}

// ============================================================
// TYPES
// ============================================================

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean; // If true, loads eagerly (above the fold)
  showBlur?: boolean; // Show blur-up effect
  fallback?: string; // Fallback image URL on error
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  objectFit?: "cover" | "contain" | "fill" | "none";
  sizes?: string; // For responsive images, e.g. "(max-width: 768px) 100vw, 50vw"
}

// ============================================================
// COMPONENT
// ============================================================

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  quality = 75,
  priority = false,
  showBlur = true,
  fallback = "https://placehold.co/400x400/f3f4f6/9ca3af?text=Image",
  onLoad,
  onError,
  style,
  objectFit = "cover",
  sizes,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority images load immediately
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ---- Optimized URL (cached) ----
  const optimizedSrc = getCachedUrl(`opt_${src}_${width}_${height}_${quality}`, () =>
    optimizeCloudinaryUrl(src, { width, height, quality, format: "auto", fit: "fill" })
  );

  // ---- Blur placeholder URL (cached) ----
  const placeholderSrc = getCachedUrl(`blur_${src}`, () =>
    getBlurPlaceholder(src)
  );

  // ---- Responsive srcSet (cached) ----
  const srcSet = getCachedUrl(`srcset_${src}`, () =>
    getResponsiveSrcSet(src)
  );

  // ---- Intersection Observer for lazy loading ----
  useEffect(() => {
    if (priority || isInView) return; // Already loading

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ width: "100%", height: "100%", ...style }}
    >
      {/* BLUR PLACEHOLDER */}
      {showBlur && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full transition-opacity duration-300"
          style={{
            objectFit,
            filter: "blur(20px)",
            transform: "scale(1.1)", // Prevent blur edges from showing
            opacity: isLoaded ? 0 : 1,
          }}
          draggable={false}
        />
      )}

      {/* MAIN IMAGE — only renders when in viewport */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={optimizedSrc || src}
          srcSet={srcSet || undefined}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className={`transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          style={{ objectFit, width: "100%", height: "100%" }}
          onLoad={handleLoad}
          onError={handleError}
          draggable={false}
        />
      )}

      {/* FALLBACK on error */}
      {hasError && (
        <img
          src={fallback}
          alt={alt}
          className={className}
          style={{ objectFit, width: "100%", height: "100%" }}
        />
      )}

      {/* LOADING SHIMMER (while not in view or not loaded) */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
          style={{ backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }}
        />
      )}
    </div>
  );
});

export default OptimizedImage;
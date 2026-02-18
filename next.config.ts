import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================
  // IMAGE OPTIMIZATION
  // ============================================================
  images: {
    // Allow images from these domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],

    // Supported image formats — browser will get WebP/AVIF automatically
    formats: ["image/avif", "image/webp"],

    // Cache optimized images for 60 days (in seconds)
    minimumCacheTTL: 60 * 60 * 24 * 60,

    // Responsive image sizes (used by Next/Image srcSet generation)
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ============================================================
  // HTTP CACHING HEADERS
  // Aggressive caching for static assets and images
  // ============================================================
  async headers() {
    return [
      // Cache all images for 1 year
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache static assets
      {
        source: "/assets/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache API responses that change infrequently (gold rate, banners, etc.)
      {
        source: "/api/admin/settings",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/api/banners",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/api/categories",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=600, stale-while-revalidate=1200",
          },
        ],
      },
    ];
  },

  // ============================================================
  // COMPRESSION
  // ============================================================
  compress: true,
};

export default nextConfig;
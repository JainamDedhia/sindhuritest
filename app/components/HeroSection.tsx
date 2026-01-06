"use client";

import { useEffect, useState } from "react";
import MobileStackCarousel from "./MobileStackCarousel";

type Banner = {
  id: string;
  image_url: string;
  device_type: "desktop" | "mobile";
  title?: string;
  subtitle?: string;
};

export default function HeroSection() {
  const [desktopBanners, setDesktopBanners] = useState<Banner[]>([]);
  const [mobileBanners, setMobileBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ================= FETCH BANNERS ================= */
  useEffect(() => {
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        setDesktopBanners(
          data.filter((b: Banner) => b.device_type === "desktop")
        );
        setMobileBanners(
          data.filter((b: Banner) => b.device_type === "mobile")
        );
      })
      .catch(console.error);
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (desktopBanners.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === desktopBanners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [desktopBanners.length]);

  return (
    <section className="w-full">

      {/* ================= DESKTOP CAROUSEL ================= */}
      <div className="hidden md:block overflow-hidden relative">
        {desktopBanners.length > 0 ? (
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {desktopBanners.map((banner) => (
              <div
                key={banner.id}
                className="min-w-full aspect-[16/6] relative"
              >
                <img
                  src={banner.image_url}
                  className="w-full h-full object-cover"
                  alt="Hero banner"
                />

                {(banner.title || banner.subtitle) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="text-center text-white">
                      <h1 className="text-4xl font-semibold">
                        {banner.title}
                      </h1>
                      <p className="mt-2 text-sm opacity-90">
                        {banner.subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <DesktopFallback />
        )}

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {desktopBanners.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition
                ${i === activeIndex
                  ? "bg-white"
                  : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* ================= MOBILE CAROUSEL ================= */}
          <div className="block md:hidden">
            {mobileBanners.length > 0 ? (
              <MobileStackCarousel banners={mobileBanners} />
            ): (
              <div className="px-[12.5vw] py-8">
                <div className="aspect-[3/4] w-[75vw] rounded-[2rem] bg-gray-100 animate-pulse" />
              </div>
            )}
          </div>
    </section>
  );
}

/* ================= FALLBACKS ================= */

function DesktopFallback() {
  return (
    <div className="w-full aspect-[16/6]
                    flex items-center justify-center
                    bg-[var(--color-ivory)]">
      <div className="text-center">
        <h1 className="text-4xl font-semibold">
          Timeless Jewellery
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Crafted for every moment
        </p>
      </div>
    </div>
  );
}

function MobileFallback() {
  return (
    <div className="w-full h-[320px]
                    rounded-xl flex items-center justify-center
                    bg-[var(--color-ivory)]">
      <p className="text-sm text-[var(--color-text-secondary)]">
        Discover our latest collection
      </p>
    </div>
  );
}
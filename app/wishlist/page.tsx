"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles, Package } from "lucide-react";

interface WishlistItem {
  id: number;
  name: string;
  weight: string;
  category: string;
  description: string;
  image: string;
  inStock: boolean;
}

// Hook to read/write wishlist from localStorage
function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const removeItem = (id: number) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem("wishlist");
  };

  return { items, removeItem, clearAll };
}

export default function WishlistPage() {
  const { items, removeItem, clearAll } = useWishlist();
  const [removing, setRemoving] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    setRemoving(id);
    setTimeout(() => {
      removeItem(id);
      setRemoving(null);
    }, 400);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDFBF7" }}>

      {/* ============ LUXURY HERO ============ */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A0A05 0%, #2D0A0A 40%, #1A0505 75%, #0D0000 100%)",
          minHeight: "280px",
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 120%, rgba(200,164,93,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Floating hearts */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 22}%`,
              opacity: 0.06 + i * 0.03,
              fontSize: `${14 + (i % 3) * 8}px`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              color: "#C8A45D",
            }}
          >
            ♥
          </div>
        ))}

        {/* Gold top line */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C8A45D, #E5D3B3, #C8A45D, transparent)" }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: "280px" }}>
          <div className="flex items-center gap-3 mb-5">
            <div style={{ height: "1px", width: "40px", background: "linear-gradient(to right, transparent, #C8A45D)" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: "#C8A45D" }}>
              Sinduri Jewellers
            </span>
            <div style={{ height: "1px", width: "40px", background: "linear-gradient(to left, transparent, #C8A45D)" }} />
          </div>

          <Heart
            size={28}
            fill="rgba(200,164,93,0.3)"
            style={{ color: "#C8A45D", marginBottom: "16px" }}
          />

          <h1
            className="font-serif text-4xl md:text-6xl font-light leading-tight mb-4"
            style={{ color: "#FDFBF7", letterSpacing: "-0.02em" }}
          >
            Your{" "}
            <span
              className="italic"
              style={{
                backgroundImage: "linear-gradient(135deg, #C8A45D, #E5D3B3, #B58A3D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Wishlist
            </span>
          </h1>

          <p className="text-sm font-light" style={{ color: "rgba(253,251,247,0.45)", letterSpacing: "0.1em" }}>
            {items.length === 0
              ? "Your curated desires await"
              : `${items.length} treasured ${items.length === 1 ? "piece" : "pieces"}`}
          </p>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 w-full h-12 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #FDFBF7)" }}
        />
      </div>

      {/* ============ CONTENT ============ */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {items.length === 0 ? (
          /* ===== EMPTY STATE ===== */
          <div
            className="flex flex-col items-center justify-center py-24 text-center rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #F5F0E8, #FDFBF7)",
              border: "1px solid rgba(181,138,61,0.12)",
            }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
              style={{ background: "rgba(200,164,93,0.08)", border: "1px solid rgba(200,164,93,0.2)" }}
            >
              <Heart size={36} style={{ color: "#C8A45D", opacity: 0.5 }} />
            </div>

            <h2 className="font-serif text-3xl mb-3" style={{ color: "#1A0A05" }}>
              Nothing saved yet
            </h2>
            <p className="text-sm mb-8 max-w-xs" style={{ color: "rgba(26,10,5,0.45)", lineHeight: 1.7 }}>
              Browse our collection and save the pieces that speak to your heart
            </p>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300"
              style={{
                background: "#1A0A05",
                color: "#C8A45D",
                border: "1px solid #1A0A05",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C8A45D";
                e.currentTarget.style.color = "#1A0A05";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1A0A05";
                e.currentTarget.style.color = "#C8A45D";
              }}
            >
              <Sparkles size={14} />
              Explore Collection
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            {/* ===== HEADER BAR ===== */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl" style={{ color: "#1A0A05" }}>
                  Saved Pieces
                </h2>
                <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: "rgba(181,138,61,0.7)" }}>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>

              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                style={{
                  border: "1px solid rgba(181,138,61,0.25)",
                  color: "rgba(26,10,5,0.4)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(220,60,60,0.4)";
                  e.currentTarget.style.color = "#CC3333";
                  e.currentTarget.style.background = "rgba(220,60,60,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(181,138,61,0.25)";
                  e.currentTarget.style.color = "rgba(26,10,5,0.4)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Trash2 size={12} />
                Clear All
              </button>
            </div>

            {/* ===== WISHLIST ITEMS ===== */}
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-5 rounded-2xl p-4 transition-all duration-300"
                  style={{
                    background: removing === item.id ? "rgba(220,60,60,0.04)" : "#FFFFFF",
                    border: removing === item.id
                      ? "1px solid rgba(220,60,60,0.15)"
                      : "1px solid rgba(181,138,61,0.12)",
                    opacity: removing === item.id ? 0.4 : 1,
                    transform: removing === item.id ? "translateX(20px)" : "translateX(0)",
                    boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                    animation: `fadeUp 0.4s ease both`,
                    animationDelay: `${idx * 60}ms`,
                  }}
                >
                  {/* Image */}
                  <Link href={`/products/${item.id}`} className="flex-shrink-0">
                    <div
                      className="relative rounded-xl overflow-hidden"
                      style={{ width: "80px", height: "80px", background: "#F5F0E8" }}
                    >
                      <Image
                        src={item.image || "https://placehold.co/80x80"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {!item.inStock && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(0,0,0,0.45)" }}
                        >
                          <span
                            className="text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                            style={{ background: "rgba(255,255,255,0.9)", color: "#1A0A05" }}
                          >
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: "rgba(181,138,61,0.7)" }}
                    >
                      {item.category}
                    </p>
                    <Link href={`/products/${item.id}`}>
                      <h3
                        className="font-serif text-lg leading-tight transition-colors duration-200 truncate"
                        style={{ color: "#1A0A05" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#B58A3D")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#1A0A05")}
                      >
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs mt-1" style={{ color: "rgba(26,10,5,0.4)" }}>
                      {item.weight}g
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {item.inStock ? (
                      <Link
                        href={`/products/${item.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                        style={{
                          background: "#1A0A05",
                          color: "#C8A45D",
                          border: "1px solid #1A0A05",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#C8A45D";
                          e.currentTarget.style.color = "#1A0A05";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#1A0A05";
                          e.currentTarget.style.color = "#C8A45D";
                        }}
                      >
                        <ShoppingBag size={11} />
                        Enquire
                      </Link>
                    ) : (
                      <span
                        className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          border: "1px solid rgba(181,138,61,0.2)",
                          color: "rgba(181,138,61,0.5)",
                        }}
                      >
                        Unavailable
                      </span>
                    )}

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 rounded-full transition-all duration-200"
                      style={{ color: "rgba(26,10,5,0.25)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#CC3333";
                        e.currentTarget.style.background = "rgba(220,60,60,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(26,10,5,0.25)";
                        e.currentTarget.style.background = "transparent";
                      }}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== FOOTER CTA ===== */}
            <div
              className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #1A0A05, #2D0A0A)",
                border: "1px solid rgba(200,164,93,0.2)",
              }}
            >
              <div>
                <p className="font-serif text-lg" style={{ color: "#FDFBF7" }}>
                  Discover More Treasures
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(253,251,247,0.4)" }}>
                  Explore our full collection
                </p>
              </div>
              <Link
                href="/products"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
                style={{
                  background: "rgba(200,164,93,0.15)",
                  color: "#C8A45D",
                  border: "1px solid rgba(200,164,93,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#C8A45D";
                  e.currentTarget.style.color = "#1A0A05";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(200,164,93,0.15)";
                  e.currentTarget.style.color = "#C8A45D";
                }}
              >
                Browse Collection
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          from { transform: translateY(0px) rotate(-5deg); }
          to { transform: translateY(-8px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
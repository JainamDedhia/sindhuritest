"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag, Trash2, ArrowRight, Sparkles, MessageCircle,
  ChevronRight, Package, X, Loader2, Minus, Plus, RefreshCw,
} from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, isLoading, forceRefresh } = useCartStore();
  const [removing, setRemoving] = useState<string | number | null>(null);
  const [enquirySent, setEnquirySent] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/cart");
    } else if (status === "authenticated") {
      const refresh = async () => {
        setIsRefreshing(true);
        await forceRefresh();
        setIsRefreshing(false);
      };
      refresh();
    }
  }, [status, router, forceRefresh]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#FDFBF7" }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#C8A45D] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {status === "loading" ? "Loading..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalWeight = items.reduce((s, i) => s + (Number(i.weight) * i.quantity), 0);

  const handleRemove = async (id: string | number) => {
    setRemoving(id);
    try {
      await removeItem(id);
    } finally {
      setRemoving(null);
    }
  };

  const handleUpdateQty = async (id: string | number, qty: number) => {
    if (qty < 1) return handleRemove(id);
    await updateQuantity(id, qty);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await forceRefresh();
    setIsRefreshing(false);
  };

  const handleEnquire = () => {
    const lines = items.map((i) => `• ${i.title} (${i.weight}g) × ${i.quantity}`);
    const message = encodeURIComponent(
      `Hello! I'd like to enquire about the following pieces:\n\n${lines.join("\n")}\n\nPlease let me know availability and pricing.`
    );
    window.open(`https://wa.me/918668679249?text=${message}`, "_blank");
    setEnquirySent(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDFBF7" }}>

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A0A05 0%, #2D0A0A 40%, #1A0505 75%, #0D0000 100%)",
          minHeight: "260px",
        }}
      >
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 120%, rgba(200,164,93,0.18) 0%, transparent 70%)" }}
        />
        {/* Floating bag icons */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{ right: `${8 + i * 20}%`, top: `${15 + (i % 2) * 30}%`, opacity: 0.04 + i * 0.02,
              animation: `float ${4 + i * 0.7}s ease-in-out infinite alternate` }}>
            <ShoppingBag size={28 + i * 10} style={{ color: "#C8A45D" }} />
          </div>
        ))}
        {/* Gold top line */}
        <div className="absolute top-0 left-0 w-full"
          style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C8A45D, #E5D3B3, #C8A45D, transparent)" }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: "260px" }}>
          <div className="flex items-center gap-3 mb-5">
            <div style={{ height: "1px", width: "40px", background: "linear-gradient(to right, transparent, #C8A45D)" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: "#C8A45D" }}>Sinduri Jewellers</span>
            <div style={{ height: "1px", width: "40px", background: "linear-gradient(to left, transparent, #C8A45D)" }} />
          </div>
          <ShoppingBag size={26} style={{ color: "#C8A45D", marginBottom: "14px", opacity: 0.8 }} />
          <h1 className="font-serif font-light leading-tight mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FDFBF7", letterSpacing: "-0.02em" }}>
            Your{" "}
            <span className="italic" style={{
              backgroundImage: "linear-gradient(135deg, #C8A45D, #E5D3B3, #B58A3D)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Enquiry Bag</span>
          </h1>
          <p className="text-sm font-light" style={{ color: "rgba(253,251,247,0.45)", letterSpacing: "0.1em" }}>
            {items.length === 0
              ? "Nothing added yet"
              : `${totalItems} ${totalItems === 1 ? "piece" : "pieces"} · ${totalWeight.toFixed(2)}g total`}
          </p>
          {/* Refresh button */}
          {session?.user && (
            <button onClick={handleRefresh} disabled={isRefreshing}
              className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
              style={{ border: "1px solid rgba(200,164,93,0.3)", color: "rgba(200,164,93,0.6)", background: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#C8A45D"; e.currentTarget.style.borderColor = "rgba(200,164,93,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(200,164,93,0.6)"; e.currentTarget.style.borderColor = "rgba(200,164,93,0.3)"; }}
            >
              <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Syncing..." : "Refresh"}
            </button>
          )}
        </div>
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-12 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #FDFBF7)" }} />
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Loading state */}
        {isLoading && items.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "#F5F0E8" }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl"
            style={{ background: "linear-gradient(135deg, #F5F0E8, #FDFBF7)", border: "1px solid rgba(181,138,61,0.12)" }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
              style={{ background: "rgba(200,164,93,0.08)", border: "1px solid rgba(200,164,93,0.2)" }}>
              <ShoppingBag size={36} style={{ color: "#C8A45D", opacity: 0.4 }} />
            </div>
            <h2 className="font-serif text-3xl mb-3" style={{ color: "#1A0A05" }}>Your bag is empty</h2>
            <p className="text-sm mb-8 max-w-xs" style={{ color: "rgba(26,10,5,0.45)", lineHeight: 1.7 }}>
              Browse our collection and add pieces you'd like to enquire about
            </p>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300"
              style={{ background: "#1A0A05", color: "#C8A45D" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#C8A45D"; e.currentTarget.style.color = "#1A0A05"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1A0A05"; e.currentTarget.style.color = "#C8A45D"; }}
            >
              <Sparkles size={14} /> Explore Collection <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Items + Summary */}
        {items.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── ITEM LIST ── */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl" style={{ color: "#1A0A05" }}>Selected Pieces</h2>
                <button onClick={clearCart}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                  style={{ border: "1px solid rgba(181,138,61,0.25)", color: "rgba(26,10,5,0.4)", background: "transparent" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(220,60,60,0.4)"; e.currentTarget.style.color = "#CC3333"; e.currentTarget.style.background = "rgba(220,60,60,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(181,138,61,0.25)"; e.currentTarget.style.color = "rgba(26,10,5,0.4)"; e.currentTarget.style.background = "transparent"; }}
                >
                  <Trash2 size={12} /> Clear All
                </button>
              </div>

              {items.map((item, idx) => (
                <div key={item.id}
                  className="flex items-center gap-4 rounded-2xl p-4"
                  style={{
                    background: removing === item.id ? "rgba(220,60,60,0.03)" : "#FFFFFF",
                    border: removing === item.id ? "1px solid rgba(220,60,60,0.15)" : "1px solid rgba(181,138,61,0.12)",
                    opacity: removing === item.id || isLoading ? 0.5 : 1,
                    transform: removing === item.id ? "translateX(20px)" : "translateX(0)",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 20px rgba(0,0,0,0.03)",
                    animation: `fadeUp 0.4s ease both`,
                    animationDelay: `${idx * 70}ms`,
                  }}>

                  {/* Image */}
                  <Link href={`/products/${item.id}`} className="flex-shrink-0">
                    <div className="relative rounded-xl overflow-hidden"
                      style={{ width: "80px", height: "80px", background: "#F5F0E8" }}>
                      <img
                        src={item.image || "https://placehold.co/80x80/F5F0E8/C8A45D?text=✦"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(0,0,0,0.45)" }}>
                          <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(255,255,255,0.9)", color: "#1A0A05" }}>Sold Out</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                      style={{ color: "rgba(181,138,61,0.7)" }}>{item.category}</p>
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-serif text-base leading-snug truncate"
                        style={{ color: "#1A0A05" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#B58A3D")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#1A0A05")}
                      >{item.title}</h3>
                    </Link>
                    <p className="text-xs mt-1" style={{ color: "rgba(26,10,5,0.4)" }}>
                      {item.weight}g per piece
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-full overflow-hidden"
                        style={{ border: "1px solid rgba(181,138,61,0.25)" }}>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-40"
                          style={{ color: "#B58A3D" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(181,138,61,0.1)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >−</button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums" style={{ color: "#1A0A05" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-40"
                          style={{ color: "#B58A3D" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(181,138,61,0.1)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >+</button>
                      </div>
                      <span className="text-[10px] font-medium" style={{ color: "rgba(26,10,5,0.3)" }}>
                        {(Number(item.weight) * item.quantity).toFixed(2)}g total
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={isLoading}
                    className="flex-shrink-0 p-2 rounded-full transition-all duration-200 disabled:opacity-40"
                    style={{ color: "rgba(26,10,5,0.2)" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#CC3333"; e.currentTarget.style.background = "rgba(220,60,60,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(26,10,5,0.2)"; e.currentTarget.style.background = "transparent"; }}
                  ><X size={15} /></button>
                </div>
              ))}
            </div>

            {/* ── ENQUIRY SUMMARY ── */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="rounded-3xl overflow-hidden sticky top-24"
                style={{
                  background: "linear-gradient(160deg, #1A0A05, #2D0A0A)",
                  border: "1px solid rgba(200,164,93,0.2)",
                  boxShadow: "0 20px 60px rgba(26,10,5,0.25)",
                }}>
                <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C8A45D, #E5D3B3, #C8A45D, transparent)" }} />

                <div className="p-7">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles size={14} style={{ color: "#C8A45D" }} />
                    <h3 className="font-serif text-lg" style={{ color: "#FDFBF7" }}>Enquiry Summary</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Total Pieces", value: totalItems },
                      { label: "Total Weight", value: `${totalWeight.toFixed(2)}g` },
                      { label: "Collections", value: [...new Set(items.map(i => i.category))].join(", ") },
                    ].map((row, i, arr) => (
                      <div key={row.label}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: "rgba(253,251,247,0.4)" }}>{row.label}</span>
                          <span className={`font-serif ${i < 2 ? "text-lg" : "text-sm text-right max-w-[140px] leading-snug"}`}
                            style={{ color: i < 2 ? "#C8A45D" : "rgba(253,251,247,0.65)" }}>
                            {row.value}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className="mt-3" style={{ height: "1px", background: "rgba(200,164,93,0.1)" }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div className="rounded-xl p-4 mb-6"
                    style={{ background: "rgba(200,164,93,0.07)", border: "1px solid rgba(200,164,93,0.15)" }}>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                      We'll get back to you with pricing, availability, and customisation options within 24 hours.
                    </p>
                  </div>

                  {/* CTA */}
                  <button onClick={handleEnquire} disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 mb-3 disabled:opacity-50"
                    style={{
                      background: enquirySent ? "rgba(200,164,93,0.2)" : "linear-gradient(135deg, #C8A45D, #B58A3D)",
                      color: enquirySent ? "#C8A45D" : "#1A0A05",
                      border: "1px solid rgba(200,164,93,0.3)",
                    }}>
                    <MessageCircle size={16} />
                    {enquirySent ? "Enquiry Sent!" : "Send Enquiry via WhatsApp"}
                  </button>

                  <Link href="/products"
                    className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                    style={{ color: "rgba(200,164,93,0.4)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#C8A45D")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,164,93,0.4)")}
                  >
                    Continue Browsing <ChevronRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Mini item list */}
              <div className="mt-4 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "#F5F0E8", border: "1px solid rgba(181,138,61,0.1)" }}>
                    <Package size={13} style={{ color: "#C8A45D", flexShrink: 0 }} />
                    <span className="text-xs flex-1 truncate" style={{ color: "#1A0A05" }}>{item.title}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: "#B58A3D" }}>×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          from { transform: translateY(0px) rotate(-3deg); }
          to { transform: translateY(-10px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
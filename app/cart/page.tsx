"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, RefreshCw, Loader2, MessageCircle } from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackToHome from "../components/BackToHome";


export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    isLoading,
    error,
    forceRefresh,
  } = useCartStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔥 CLIENT-SIDE AUTH CHECK
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/cart");
    } else if (status === "authenticated") {
      const refreshCart = async () => {
        setIsRefreshing(true);
        await forceRefresh();
        setIsRefreshing(false);
      };
      refreshCart();
    }
  }, [status, router, forceRefresh]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await forceRefresh();
    setIsRefreshing(false);
  };

  // 🔥 WHATSAPP CHECKOUT HANDLER
  const handleWhatsAppEnquiry = () => {
    // ⚠️ REPLACE THIS WITH YOUR ACTUAL BUSINESS WHATSAPP NUMBER
    // Format: Country code + phone number (No '+' sign, no spaces)
    // Example for India: "919876543210"
    

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0).toFixed(2);
    const ADMIN_PHONE_NUMBER = 8668679249

    // Build the message string
    let message = `Hello Sinduri Jewellers, I would like to enquire about the following items from my cart:\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.title}* (${item.category})\n`;
      message += `   Qty: ${item.quantity} | Total Weight: ${(item.weight * item.quantity).toFixed(2)}g\n\n`;
    });

    message += `------------------------\n`;
    message += `*Total Items:* ${totalItems}\n`;
    message += `*Total Weight:* ${totalWeight}g\n\n`;
    message += `Please let me know the pricing and next steps. Thank you!`;

    // Encode the text for a URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create the WhatsApp API link and open in a new tab
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  // 🔥 SHOW LOADING WHILE CHECKING AUTH
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-(--color-gold-primary) mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔥 SHOW NOTHING WHILE REDIRECTING
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-(--color-gold-primary) mx-auto mb-4" />
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // 🔥 ONLY RENDER IF AUTHENTICATED
  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8 max-w-7xl">
      <BackToHome />
      
      {/* HEADER WITH SYNC STATUS */}
      <div className="mb-8 flex items-center justify-between mt-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1A0A05]">Shopping Bag ({items.length})</h1>
        
        <div className="flex items-center gap-3">
          {session?.user && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-[#C8A45D]/30 bg-[#FDFBF7] py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm text-[#C8A45D]">
            <ShoppingBag size={36} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-2xl text-[#1A0A05]">Your bag is empty</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-4">Looks like you haven't added any beautiful pieces to your cart yet.</p>
          <Link
            href="/products"
            className="rounded-full bg-[#1A0A05] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#C8A45D] hover:shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* ITEMS LIST */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 md:gap-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all ${
                  isLoading ? 'opacity-50' : 'hover:shadow-md'
                }`}
              >
                <div className="h-28 w-28 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-xl bg-[#FDFBF7] border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between py-1">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-2 font-serif text-lg text-[#1A0A05] leading-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs tracking-wider uppercase text-[#C8A45D] font-semibold">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-gray-300 hover:text-red-500 disabled:opacity-50 transition-colors p-1 h-fit"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="p-2 text-gray-500 hover:bg-gray-50 hover:text-[#1A0A05] disabled:opacity-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#1A0A05]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="p-2 text-gray-500 hover:bg-gray-50 hover:text-[#1A0A05] disabled:opacity-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* WEIGHT */}
                    <div className="text-right">
                      <p className="text-base font-bold text-[#1A0A05]">
                        {(item.weight * item.quantity).toFixed(2)}g
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-400 font-medium">
                          {item.weight}g each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="h-fit w-full rounded-2xl border border-[#E8DDD0] bg-[#FDFBF7] p-6 lg:p-8 shadow-sm lg:w-[400px] lg:sticky lg:top-24">
            <h2 className="mb-6 font-serif text-2xl text-[#1A0A05]">Cart Summary</h2>

            <div className="space-y-4 border-b border-[#E8DDD0] pb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total Items</span>
                <span className="font-bold text-[#1A0A05]">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Total Weight</span>
                <span className="font-bold text-[#1A0A05] text-lg">
                  {items.reduce((sum, item) => sum + (item.weight * item.quantity), 0).toFixed(2)}g
                </span>
              </div>
            </div>

            {/* 🔥 UPDATED WHATSAPP BUTTON */}
            <button 
              onClick={handleWhatsAppEnquiry}
              disabled={isLoading}
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A0A05] px-6 py-4 text-sm font-semibold tracking-wide uppercase text-white transition-all hover:bg-[#C8A45D] hover:shadow-lg active:scale-95 disabled:opacity-50"
            >
              <MessageCircle size={18} />
              Enquire on WhatsApp
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 ml-1" />
            </button>

            <p className="mt-5 text-center text-[11px] text-gray-400 uppercase tracking-widest font-medium">
              Quality Products on sinduri Jwellers
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
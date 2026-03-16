"use client";

import Link from "next/link";
import { Heart, MessageCircle, Check, Loader2, ShoppingBag, Scale } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useUIStore } from "@/app/store/uiStore";
import { useState } from "react";
import OptimizedImage from "@/app/components/OptimizedImage";

interface ProductProps {
  id: number | string;
  title: string;
  category: string;
  weight: string;
  description: string;
  image: string;
  inStock: boolean;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const ADMIN_PHONE_NUMBER = "917021419016";
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const isInCart = useCartStore((state) => state.isInCart(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));
  const showToast = useUIStore((state) => state.showToast);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      showToast("Please sign in first", "info");
      setTimeout(() => router.push("/auth/login?callbackUrl=" + window.location.pathname), 1000);
      return;
    }
    if (!product.inStock) return showToast("Item is Sold Out", "error");

    setIsAdding(true);
    try {
      await addToCart({
        id: product.id,
        title: product.title,
        category: product.category,
        description: product.description,
        weight: parseFloat(product.weight),
        image: product.image,
        inStock: product.inStock,
      });
      showToast("Added to Cart", "success");
    } catch (error: any) {
      showToast(error.message || "Failed", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewCart = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/cart');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      showToast("Please sign in first", "info");
      return setTimeout(() => router.push("/auth/login?callbackUrl=" + window.location.pathname), 1000);
    }
    toggleWishlist({
      id: product.id,
      title: product.title,
      category: product.category,
      description: product.description,
      weight: product.weight,
      image: product.image,
      inStock: product.inStock,
    });
    showToast(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist", "success");
  };

  const handleEnquire = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSending(true);

    const stockStatus = product.inStock ? "✅ In Stock" : "❌ Sold Out";
    const productPageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${product.id}`;

    const message = [
      `🪙 *Enquiry — Sinduri Jewellers*`,
      ``,
      `*Product:* ${product.title}`,
      `*Category:* ${product.category}`,
      `*Weight:* ${product.weight}g`,
      `*Product ID:* ${product.id}`,
      `*Status:* ${stockStatus}`,
      ``,
      `🔗 *View Product:* ${productPageUrl}`,
      ``,
      `I am interested in this product. Please share pricing and availability details.`,
    ].join("\n");

    setTimeout(() => {
      window.open(`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
      setIsSending(false);
    }, 300);
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-gray-200">
      
      {/* IMAGE AREA */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F3F0]">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {/* 🔥 OPTIMIZED: Uses blur-up + lazy loading + Cloudinary compression */}
          <OptimizedImage
            src={product.image}
            alt={product.title}
            className="transition-transform duration-700 ease-out group-hover:scale-105"
            width={400}
            height={500}
            quality={78}
            showBlur={true}
            fallback="https://placehold.co/400x500/f3f4f6/9ca3af?text=Jewellery"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] flex items-start p-3 z-10">
            <span className="bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md hover:scale-110 z-10"
        >
          <Heart 
            size={16} 
            className={`transition-all duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} 
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        
        {/* 🔥 NEW: Category & Weight Row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {/* Category (Left) */}
          <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-gold-primary)] font-bold truncate">
            {product.category}
          </span>
          
          {/* Weight (Right) */}
          <div className="flex items-center gap-1 min-w-max text-[10px] font-semibold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
            <Scale size={10} className="text-gray-400" />
            <span>{product.weight}g</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="mb-3 block flex-1">
          <h3 className="font-serif text-[15px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--color-gold-primary)] transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        {/* BUTTONS */}
        {/* MOBILE & DESKTOP: Stacked Column Layout */}
        <div className="mt-auto flex flex-col gap-2">
          
          {/* Primary: Cart */}
          {isInCart ? (
            <button
              onClick={handleViewCart}
              className="group flex w-full items-center justify-center gap-2 py-2.5 md:py-3 rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all duration-500 
                /* Success State: Deep Forest / Teal */
                bg-gradient-to-r from-[#0F2922] via-[#1A3F34] to-[#0F2922] bg-[length:200%_auto] hover:bg-right text-white border border-[#1A3F34] shadow-md"
            >
              <Check size={14} className="text-[#4ADE80] group-hover:scale-110 transition-transform" /> 
              <span className="whitespace-nowrap">View Cart</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className="flex w-full items-center justify-center gap-2 py-2.5 md:py-3 rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed
                /* Premium Deep Mahogany / Burgundy Gradient */
                bg-gradient-to-r from-[#2A1111] via-[#4A1C1C] to-[#2A1111] bg-[length:200%_auto] hover:bg-right text-white shadow-[0_4px_15px_rgba(74,28,28,0.2)] hover:shadow-[0_4px_20px_rgba(74,28,28,0.4)] border border-[#3A1515]"
            >
              {isAdding ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <>
                  <ShoppingBag size={14} className="text-[#C8A45D]" />
                  <span className="whitespace-nowrap">{product.inStock ? "Add to Cart" : "Sold Out"}</span>
                </>
              )}
            </button>
          )}

          {/* Secondary: WhatsApp Enquire */}
          <button
            onClick={handleEnquire}
            disabled={isSending}
            aria-label="Enquire on WhatsApp"
            className="flex w-full items-center justify-center gap-2 py-2 md:py-2.5 rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:bg-[#25D366]/5 hover:border-[#25D366] shadow-[0_2px_8px_rgba(0,0,0,0.02)] disabled:opacity-60"
          >
            {isSending ? (
              <Loader2 className="animate-spin w-4 h-4 text-[#25D366]" />
            ) : (
              <>
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span className="text-[9px] min-[380px]:text-[10px] md:text-[11px] text-gray-700 hover:text-[#25D366] font-bold uppercase tracking-wider md:tracking-widest whitespace-nowrap transition-colors">
                  Whatsapp
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
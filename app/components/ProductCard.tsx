"use client";

import Link from "next/link";
import { Heart, MessageCircle, Check, Loader2, ShoppingBag, Scale } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useUIStore } from "@/app/store/uiStore";
import { useState } from "react";

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
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Weight Badge - shows on hover */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <Scale size={10} />
          {product.weight}g
        </div>

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] flex items-start p-3">
            <span className="bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md hover:scale-110"
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
        
        {/* Category */}
        <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-gold-primary)] font-bold mb-1.5 truncate">
          {product.category}
        </span>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="mb-3 block flex-1">
          <h3 className="font-serif text-[15px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--color-gold-primary)] transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        {/* BUTTONS */}
        <div className="mt-auto flex flex-col gap-1.5">
          
          {/* Primary: Cart */}
          {isInCart ? (
            <button
              onClick={handleViewCart}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-green-700 text-white hover:bg-green-800 transition-all duration-200 w-full"
            >
              <Check size={13}/> View Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-gray-900 text-white hover:bg-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed w-full"
            >
              {isAdding ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <>
                  <ShoppingBag size={13} />
                  {product.inStock ? "Add to Cart" : "Sold Out"}
                </>
              )}
            </button>
          )}

          {/* Secondary: WhatsApp Enquire */}
          <button
            onClick={handleEnquire}
            disabled={isSending}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-white text-gray-700 border border-gray-200 hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-all duration-200 w-full disabled:opacity-60"
          >
            {isSending ? (
              <Loader2 size={13} className="animate-spin text-green-600" />
            ) : (
              <>
                <MessageCircle size={13} />
                Enquire via WhatsApp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
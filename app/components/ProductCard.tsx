"use client";

import Link from "next/link";
import { Heart, ShoppingBag, MessageCircle, Check, Loader2 } from "lucide-react";
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
    const message = `Hi, I am interested in: *${product.title}* (ID: ${product.id})`;
    window.open(`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200">
      
      {/* 1. IMAGE AREA */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F9F9]">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Stock Badge */}
        {!product.inStock && (
           <div className="absolute top-0 left-0 bg-gray-900 text-white text-[10px] font-medium px-3 py-1 uppercase tracking-widest z-10">
             Sold Out
           </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full transition-all duration-200 hover:bg-white/80 hover:shadow-sm"
        >
          <Heart 
            size={20} 
            className={`transition-colors duration-300 ${isWishlisted ? "fill-red-600 text-red-600" : "text-gray-600 hover:text-gray-900"}`} 
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Category & Weight */}
        <div className="flex justify-between items-center mb-1 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
          <span>{product.category}</span>
          <span>{product.weight}g</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="mb-4 block">
          <h3 className="font-serif text-[15px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--color-gold-primary)] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* 3. BUTTONS (STACKED VERTICALLY) */}
        <div className="mt-auto flex flex-col gap-2">
          
          {/* Primary Action: Add to Cart (Solid) */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`
              flex items-center justify-center gap-2 py-2.5 rounded 
              text-[11px] font-bold uppercase tracking-wider transition-all duration-200
              ${isInCart 
                ? "bg-green-700 text-white border border-green-700" 
                : "bg-gray-900 text-white border border-gray-900 hover:bg-black"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isAdding ? <Loader2 size={14} className="animate-spin" /> : 
             isInCart ? <><Check size={14}/> Added</> : 
             "Add to Cart"}
          </button>

          {/* Secondary Action: Enquire (Outline) */}
          <button
            onClick={handleEnquire}
            className="
              flex items-center justify-center gap-2 py-2.5 rounded 
              text-[11px] font-bold uppercase tracking-wider transition-all duration-200
              bg-white text-gray-700 border border-gray-300
              hover:border-[var(--color-gold-primary)] hover:text-[var(--color-gold-primary)]
            "
          >
            <MessageCircle size={14} />
            Enquire
          </button>

        </div>
      </div>
    </div>
  );
}
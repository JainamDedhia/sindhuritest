"use client";

import Link from "next/link";
import { Heart, MessageCircle, Check, Loader2, ShoppingBag } from "lucide-react";
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

  // --- HANDLERS ---

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
    const message = `Hi, I am interested in: *${product.title}* (ID: ${product.id})`;
    window.open(`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-gray-300">
      
      {/* 1. IMAGE AREA - Changed to 'aspect-square' for wider feel */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#F9F9F9]">
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
           <div className="absolute top-0 left-0 bg-gray-900 text-white text-[10px] font-medium px-2 py-1 uppercase tracking-widest z-10">
             Sold Out
           </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md"
        >
          <Heart 
            size={18} 
            className={`transition-colors duration-300 ${isWishlisted ? "fill-red-600 text-red-600" : "text-gray-600 hover:text-gray-900"}`} 
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* 2. CONTENT AREA - Reduced padding to utilize width */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        
        {/* Category & Weight */}
        <div className="flex justify-between items-center mb-1.5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
          <span className="text-[var(--color-gold-primary)] truncate max-w-[60%]">{product.category}</span>
          <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded shrink-0">{product.weight}g</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="mb-3 block">
          <h3 className="font-serif text-[15px] md:text-[16px] text-gray-900 leading-tight line-clamp-2 group-hover:text-[var(--color-gold-primary)] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* 3. BUTTONS (Stacked & Full Width) */}
        <div className="mt-auto flex flex-col gap-2">
          
          {/* Primary Action */}
          {isInCart ? (
            <button
              onClick={handleViewCart}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg
                text-[11px] font-bold uppercase tracking-wider transition-all duration-200
                bg-green-700 text-white border border-green-700 hover:bg-green-800 shadow-sm w-full"
            >
              <Check size={14}/> View Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg
                text-[11px] font-bold uppercase tracking-wider transition-all duration-200
                bg-gray-900 text-white border border-gray-900 hover:bg-black hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              {isAdding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <ShoppingBag size={14} /> Add to Cart
                </>
              )}
            </button>
          )}

          {/* Secondary Action */}
          <button
            onClick={handleEnquire}
            className="
              flex items-center justify-center gap-2 py-2.5 rounded-lg
              text-[11px] font-bold uppercase tracking-wider transition-all duration-200
              bg-white text-gray-700 border border-gray-200 shadow-sm w-full
              hover:border-[var(--color-gold-primary)] hover:text-[var(--color-gold-primary)] hover:bg-[var(--color-gold-primary)]/5
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
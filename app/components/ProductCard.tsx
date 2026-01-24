"use client";

import Link from "next/link";
import { Heart, ShoppingBag, MessageCircle, Check, AlertCircle } from "lucide-react";
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

  // Zustand stores
  const addToCart = useCartStore((state) => state.addItem);
  const isInCart = useCartStore((state) => state.isInCart(product.id));
  
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));
  
  const showToast = useUIStore((state) => state.showToast);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔥 CHECK IF USER IS LOGGED IN FIRST
    if (!session) {
      showToast("Please sign in to add items to cart", "info");
      setTimeout(() => {
        router.push("/auth/login?callbackUrl=" + window.location.pathname);
      }, 1000);
      return;
    }

    // ✅ CHECK STOCK BEFORE ADDING
    if (!product.inStock) {
      showToast("This item is currently sold out", "error");
      return;
    }

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

      // 🔥 SHOW TOAST AFTER SUCCESSFUL ADD
      showToast(`${product.title} added to cart!`, "success");
      
    } catch (error: any) {
      // Error handling with specific messages
      if (error.message.includes("sold out")) {
        showToast("This item is currently sold out", "error");
      } else if (error.message.includes("Unauthorized")) {
        showToast("Please sign in to add items to cart", "info");
        setTimeout(() => {
          router.push("/auth/login?callbackUrl=" + window.location.pathname);
        }, 1000);
      } else {
        showToast(error.message || "Failed to add to cart", "error");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔥 CHECK IF USER IS LOGGED IN
    if (!session) {
      showToast("Please sign in to save items", "info");
      setTimeout(() => {
        router.push("/auth/login?callbackUrl=" + window.location.pathname);
      }, 1000);
      return;
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

    // 🔥 SHOW TOAST
    const action = isWishlisted ? "removed from" : "added to";
    showToast(`${product.title} ${action} wishlist!`, isWishlisted ? "info" : "success");
  };

  const handleEnquire = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = `Hello, I am interested in this Product: 
*${product.title}* 
Category: ${product.category} 
Weight: ${product.weight}g

*Image*: ${product.image}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="
          group relative w-full overflow-hidden
          rounded-xl bg-white border border-gray-100
          transition-all duration-300 cursor-pointer
          hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1
        "
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.title}
            className="
              h-full w-full object-cover
              transition-transform duration-700
              group-hover:scale-105
            "
          />

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`
              absolute top-3 right-3
              flex h-8 w-8 items-center justify-center
              rounded-full shadow-sm backdrop-blur-sm
              transition-all duration-300
              ${
                isWishlisted
                  ? "bg-red-50 text-red-500 opacity-100 translate-y-0"
                  : "bg-white/90 text-gray-700 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-red-50 hover:text-red-500"
              }
            `}
          >
            <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
          </button>

          {/* Stock Badge */}
          {product.inStock ? (
            <div className="absolute top-3 left-3 rounded bg-green-600/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md">
              IN STOCK
            </div>
          ) : (
            <div className="absolute top-3 left-3 rounded bg-red-600/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md flex items-center gap-1">
              <AlertCircle size={10} />
              SOLD OUT
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold-primary)]">
                {product.category}
              </p>
              <h3 className="line-clamp-1 text-[14px] font-semibold text-gray-900">
                {product.title}
              </h3>
            </div>
            {/* 🔥 ONLY SHOW WEIGHT, NO PRICE */}
            <span className="shrink-0 text-[14px] font-bold text-gray-900">
              {product.weight}g
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`
                flex flex-1 items-center justify-center gap-2
                rounded-lg border h-9
                text-[12px] font-semibold 
                transition-all duration-200
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  !product.inStock
                    ? "border-gray-200 bg-gray-50 text-gray-400"
                    : isInCart
                    ? "border-green-600 bg-green-50 text-green-700 hover:bg-green-100"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-900 hover:text-gray-900"
                }
              `}
            >
              {isAdding ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                  Adding...
                </>
              ) : isInCart ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> 
                  {product.inStock ? "Add" : "Sold Out"}
                </>
              )}
            </button>

            <button
              onClick={handleEnquire}
              className="
                flex flex-1 items-center justify-center gap-2
                rounded-lg bg-[var(--color-gold-primary)] h-9
                text-[12px] font-semibold text-white
                shadow-sm transition-all duration-200
                hover:bg-[var(--color-gold-accent)]
                active:scale-95
              "
            >
              <MessageCircle size={14} />
              Enquire
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
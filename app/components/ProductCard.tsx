"use client";

import { Heart, ShoppingBag, MessageCircle } from "lucide-react";

interface ProductProps {
    id: number | string;
    title: string;
    category: string;
    description: string;
    price: number;
    image: string;
    inStock: boolean;
}

export default function ProductCard({product}: {product: ProductProps}) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div
      className="
        group relative w-full overflow-hidden
        rounded-xl bg-white border border-gray-100
        transition-all duration-300
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1
      "
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={product.image} /* 3. USE DYNAMIC IMAGE */
          alt={product.title}
          className="
            h-full w-full object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
        />

        {/* WISHLIST BUTTON */}
        <button
          className="
            absolute top-3 right-3
            flex h-8 w-8 items-center justify-center
            rounded-full bg-white/90 text-gray-700
            shadow-sm backdrop-blur-sm
            opacity-0 translate-y-2
            transition-all duration-300
            group-hover:opacity-100 group-hover:translate-y-0
            hover:bg-red-50 hover:text-red-500
          "
        >
          <Heart size={16} />
        </button>

        {/* BADGE - Only show if in stock */}
        {product.inStock && (
          <div className="absolute top-3 left-3 rounded bg-black/80 px-2 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md">
            IN STOCK
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold-primary)]">
              {product.category} 
            </p>
            <h3 className="line-clamp-1 text-[14px] font-semibold text-gray-900">
              {product.title} 
            </h3>
          </div>
          <span className="shrink-0 text-[14px] font-bold text-gray-900">
            {formattedPrice} 
          </span>
        </div>

        {/* ACTIONS */}
        <div className="mt-4 flex gap-3">
          <button
            className="
              flex flex-1 items-center justify-center gap-2
              rounded-lg border border-gray-200 
              bg-white h-9
              text-[12px] font-semibold text-gray-700
              transition-all duration-200
              hover:border-gray-900 hover:text-gray-900
              active:scale-95
            "
          >
            <ShoppingBag size={14} />
            Add
          </button>

          <button
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
  );
}
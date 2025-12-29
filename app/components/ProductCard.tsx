"use client";

import { useState, useEffect } from "react"; // 1. Import Hooks
import { Heart, ShoppingBag, MessageCircle, Check } from "lucide-react";

interface ProductProps {
  id: number | string;
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  // 2. Add State for Wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);


  const ADMIN_PHONE_NUMBER = "917021419016";


  // 3. Format Price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  // 4. CHECK LocalStorage on Load
  useEffect(() => {
    // We put this in useEffect so it only runs on the client (browser)
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const items = JSON.parse(savedWishlist);
      // Check if this specific product is in the saved list
      setIsWishlisted(items.some((i: any) => i.id === product.id));
    }
  

    const savedCart = localStorage.getItem("cart");
    if(savedCart) {
      const cartItems = JSON.parse(savedCart);
      setIsInCart(cartItems.some((i: any) => i.id === product.id));
    }
  },[product.id]);

  // 5. TOGGLE Logic
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent clicking the card link if you wrap this later
    e.stopPropagation();

    const saved = localStorage.getItem("wishlist");
    let items = saved ? JSON.parse(saved) : [];

    if (isWishlisted) {
      // REMOVE: Filter out this item
      items = items.filter((i: ProductProps) => i.id !== product.id);
    } else {
      // ADD: Push this item
      items.push(product);
    }

    // Save back to storage
    localStorage.setItem("wishlist", JSON.stringify(items));
    setIsWishlisted(!isWishlisted);

    // Optional: Dispatch event so Navbar updates immediately
    window.dispatchEvent(new Event("wishlist-updated"));
  };


  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = localStorage.getItem("cart");
    const cartItems = saved ? JSON.parse(saved) : [];

    const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);

    if(existingItemIndex > -1){
      cartItems[existingItemIndex].quantity += 1;
    }
    else{
      cartItems.push({ ...product, quantity: 1});
    }

    localStorage.setItem("cart",JSON.stringify(cartItems));

    setIsInCart(true);

    window.dispatchEvent(new Event("cart-updated"));
  };


  const handleEnquire = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    const message = `Hello, I am interested in this Product: 
    *${product.title}* 
    Category: ${product.category} 
    Price: ${formattedPrice} 
    
    *Image*: ${product.image}
    
    
    
    -----------------------------
    Can you please share more details or availability? `;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl,'_blank');
  }
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
          src={product.image}
          alt={product.title}
          className="
            h-full w-full object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
        />

        {/* WISHLIST BUTTON - UPDATED */}
        <button
          onClick={toggleWishlist} /* 6. Attach Click Handler */
          className={`
            absolute top-3 right-3
            flex h-8 w-8 items-center justify-center
            rounded-full shadow-sm backdrop-blur-sm
            transition-all duration-300
            ${isWishlisted 
               ? "bg-red-50 text-red-500 opacity-100 translate-y-0" // Active (Red)
               : "bg-white/90 text-gray-700 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-red-50 hover:text-red-500" // Inactive (Hidden until hover)
            }
          `}
        >
          {/* Fill the heart if active */}
          <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
        </button>

        {/* BADGE */}
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
          <button onClick={addToCart}
            className={`
              flex flex-1 items-center justify-center gap-2
              rounded-lg border border-gray-200 
              bg-white h-9
              text-[12px] font-semibold text-gray-700
              transition-all duration-200
              hover:border-gray-900 hover:text-gray-900
              active:scale-95
              ${isInCart ? "border-green-600 bg-green-50 text-green-700 hover:bg-green-100" : "border-gray-200 bg-white text-gray-700 hover:border-gray-900 hover:text-gray-900"}
            `}
          >
            {isInCart ? (
              <>
                <Check size={14} /> Added
              </>
            ): (
              <>
                <ShoppingBag size={14} /> Add
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
  );
}
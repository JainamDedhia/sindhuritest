// app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  Package,
  Scale,
  Shield,
  Truck,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useUIStore } from "@/app/store/uiStore";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const ADMIN_PHONE = "917021419016";

  // Zustand stores
  const addToCart = useCartStore((state) => state.addItem);
  const isInCart = useCartStore((state) => state.isInCart(product?.id || ""));
  
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product?.id || ""));
  
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/products/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Product data received:", data);
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Failed to fetch product:", error);
        setLoading(false);
      });
  }, [params.id]);

  // ============= ADD TO CART WITH TOAST =============
  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!session) {
      showToast("Please sign in to add items to cart", "info");
      setTimeout(() => {
        router.push("/auth/login?callbackUrl=" + window.location.pathname);
      }, 1000);
      return;
    }

    // Check if product is in stock
    if (product.is_sold_out) {
      showToast("This item is currently sold out", "error");
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart({
        id: product.id,
        title: product.name,
        category: product.category_name || "Jewellery",
        description: product.description || "",
        weight: parseFloat(product.weight),
        image: product.image_url,
        inStock: !product.is_sold_out,
      });

      showToast(`${product.name} added to cart!`, "success");
      
    } catch (error: any) {
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
      setIsAddingToCart(false);
    }
  };

  // ============= TOGGLE WISHLIST WITH TOAST =============
  const handleToggleWishlist = () => {
    // Check if user is logged in
    if (!session) {
      showToast("Please sign in to save items", "info");
      setTimeout(() => {
        router.push("/auth/login?callbackUrl=" + window.location.pathname);
      }, 1000);
      return;
    }

    toggleWishlist({
      id: product.id,
      title: product.name,
      category: product.category_name || "Jewellery",
      description: product.description || "",
      weight: product.weight,
      image: product.image_url,
      inStock: !product.is_sold_out,
    });

    // Show toast based on action
    const action = isWishlisted ? "removed from" : "added to";
    showToast(`${product.name} ${action} wishlist!`, isWishlisted ? "info" : "success");
  };

  // ============= ENQUIRE VIA WHATSAPP =============
  const handleEnquire = () => {
    const message = `Hello, I'm interested in:
*${product.name}* (${product.product_code})
Weight: ${product.weight}g

Image: ${product.image_url}`;

    window.open(
      `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-gold-primary)]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Product not found</p>
        <button
          onClick={() => router.push("/products")}
          className="rounded-lg bg-black px-6 py-2 text-white"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* IMAGE SECTION */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", product.image_url);
                    e.currentTarget.src = "https://placehold.co/600x600?text=No+Image";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* STOCK BADGE */}
            <div className="absolute top-4 left-4">
              {product.is_sold_out ? (
                <div className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
                  SOLD OUT
                </div>
              ) : (
                <div className="rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
                  IN STOCK
                </div>
              )}
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-gold-primary)]">
              {product.category_name || "Jewellery"}
            </p>

            <h1 className="mt-2 font-serif text-3xl font-medium text-gray-900 lg:text-4xl">
              {product.name}
            </h1>

            {/* 🔥 REMOVED PRICE - ONLY WEIGHT */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Scale size={24} className="text-[var(--color-gold-primary)]" />
                <span>{product.weight}g</span>
              </div>
              <p className="text-sm text-gray-500">Product Code: {product.product_code}</p>
            </div>

            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.is_sold_out || isAddingToCart}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition ${
                  product.is_sold_out
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : isInCart
                    ? "border-2 border-green-600 bg-green-50 text-green-700"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Adding...
                  </>
                ) : isInCart ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : product.is_sold_out ? (
                  "Sold Out"
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Cart
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-current" : ""}
                  />
                  {isWishlisted ? "Saved" : "Save"}
                </button>

                <button
                  onClick={handleEnquire}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-gold-primary)] bg-[var(--color-gold-primary)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-gold-accent)]"
                >
                  <MessageCircle size={18} />
                  Enquire
                </button>
              </div>
            </div>

            {/* FEATURES */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
              {[
                { icon: Shield, text: "BIS Hallmarked" },
                { icon: Truck, text: "Free Delivery" },
                { icon: Package, text: "Easy Returns" },
                { icon: Scale, text: "Exact Weight" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                    <item.icon size={18} className="text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
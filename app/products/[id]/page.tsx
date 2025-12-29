"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const ADMIN_PHONE = "917021419016";
  const GOLD_RATE = 7000;

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

        // Check wishlist
        const wishlist = localStorage.getItem("wishlist");
        if (wishlist) {
          const items = JSON.parse(wishlist);
          setIsWishlisted(items.some((i: any) => i.id === data.id));
        }

        // Check cart
        const cart = localStorage.getItem("cart");
        if (cart) {
          const items = JSON.parse(cart);
          setIsInCart(items.some((i: any) => i.id === data.id));
        }
      })
      .catch((error) => {
        console.error("❌ Failed to fetch product:", error);
        setLoading(false);
      });
  }, [params.id]);

  const toggleWishlist = () => {
    const wishlist = localStorage.getItem("wishlist");
    let items = wishlist ? JSON.parse(wishlist) : [];

    // Create a normalized product object for localStorage
    const productForStorage = {
      id: product.id,
      title: product.name,
      category: product.category_name || "Jewellery",
      description: product.description || "",
      price: parseFloat(product.calculated_price),
      image: product.image_url,
      inStock: !product.is_sold_out,
    };

    if (isWishlisted) {
      items = items.filter((i: any) => i.id !== product.id);
    } else {
      items.push(productForStorage);
    }

    localStorage.setItem("wishlist", JSON.stringify(items));
    setIsWishlisted(!isWishlisted);
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const addToCart = () => {
    const cart = localStorage.getItem("cart");
    const items = cart ? JSON.parse(cart) : [];

    // Create a normalized product object for cart
    const productForCart = {
      id: product.id,
      title: product.name,
      category: product.category_name || "Jewellery",
      description: product.description || "",
      price: parseFloat(product.calculated_price),
      image: product.image_url,
      quantity: 1,
    };

    const existingIndex = items.findIndex((i: any) => i.id === product.id);

    if (existingIndex > -1) {
      items[existingIndex].quantity += 1;
    } else {
      items.push(productForCart);
    }

    localStorage.setItem("cart", JSON.stringify(items));
    setIsInCart(true);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleEnquire = () => {
    const message = `Hello, I'm interested in:
*${product.name}* (${product.product_code})
Weight: ${product.weight}g
Price: ₹${parseInt(product.calculated_price).toLocaleString()}

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
          {/* Image Section */}
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

          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-gold-primary)]">
              {product.category_name || "Jewellery"}
            </p>

            <h1 className="mt-2 font-serif text-3xl font-medium text-gray-900 lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-6 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{parseInt(product.calculated_price).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  @ ₹{GOLD_RATE}/gram
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Scale size={16} />
                <span>Weight: {product.weight}g</span>
              </div>
            </div>

            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            <div className="mt-8 space-y-3">
              <button
                onClick={addToCart}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition ${
                  isInCart
                    ? "border-2 border-green-600 bg-green-50 text-green-700"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isInCart ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Cart
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={toggleWishlist}
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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";

interface CartItem {
  id: number | string;
  title: string;
  category: string;
  price: number;
  weight: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Load Cart
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // 2. Update LocalStorage whenever cartItems change
  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cart-updated")); // Update Navbar count
  };

  // 3. Actions
  const incrementQty = (id: number | string) => {
    const newItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newItems);
  };

  const decrementQty = (id: number | string) => {
    const newItems = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity - 1) };
      }
      return item;
    });
    updateCart(newItems);
  };

  const removeItem = (id: number | string) => {
    const newItems = cartItems.filter((item) => item.id !== id);
    updateCart(newItems);
  };

  // 4. Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.weight * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 500; // Free shipping over 50k logic
  const total = subtotal + shipping;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return null;

  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Shopping Bag ({cartItems.length})</h1>

      {cartItems.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Your bag is empty</h3>
          <Link
            href="/products"
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* CART CONTENT Grid: Left (Items) - Right (Summary) */
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* LEFT: ITEMS LIST */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                {/* Image */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-1 font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    {/* Delete Button (Desktop) */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                      <button
                        onClick={() => decrementQty(item.id)}
                        className="p-1.5 text-gray-600 hover:bg-white hover:text-black rounded-l-lg"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2rem] text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQty(item.id)}
                        className="p-1.5 text-gray-600 hover:bg-white hover:text-black rounded-r-lg"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                       <p className="text-sm font-bold text-gray-900">
                         {formatPrice(item.weight * item.quantity)}
                       </p>
                       {item.quantity > 1 && (
                         <p className="text-[10px] text-gray-500">
                           {formatPrice(item.weight)} each
                         </p>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="h-fit w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:w-96 lg:sticky lg:top-4">
            <h2 className="mb-6 text-lg font-bold text-gray-900">Order Summary</h2>

            <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-gold-primary)] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-gold-accent)] active:scale-95">
              Enquire about this Product
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Secure Checkout • Free Returns
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
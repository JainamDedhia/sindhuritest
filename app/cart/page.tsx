"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";

export default function CartPage() {
  // 🔥 USE ZUSTAND STORE
  const { items, updateQuantity, removeItem } = useCartStore();

  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Shopping Bag ({items.length})</h1>

      {items.length === 0 ? (
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
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* ITEMS LIST */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-1 font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-600 hover:bg-white hover:text-black rounded-l-lg"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2rem] text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-600 hover:bg-white hover:text-black rounded-r-lg"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* 🔥 SHOW WEIGHT ONLY, NO PRICE */}
                    <div className="text-right">
                       <p className="text-sm font-bold text-gray-900">
                         {item.weight * item.quantity}g
                       </p>
                       {item.quantity > 1 && (
                         <p className="text-[10px] text-gray-500">
                           {item.weight}g each
                         </p>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY - NO PRICES */}
          <div className="h-fit w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:w-96 lg:sticky lg:top-4">
            <h2 className="mb-6 text-lg font-bold text-gray-900">Cart Summary</h2>

            <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total Items</span>
                <span className="font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Weight</span>
                <span className="font-semibold">
                  {items.reduce((sum, item) => sum + (item.weight * item.quantity), 0).toFixed(2)}g
                </span>
              </div>
            </div>

            <button className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-gold-primary)] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-gold-accent)] active:scale-95">
              Enquire about this Order
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Contact us for pricing • Free Returns
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ShoppingBag, Heart, User, Search, LogOut, Settings } from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pathname = usePathname();

  // 🔥 FIX: Prevent hydration mismatch by only showing counts after mount
  const [mounted, setMounted] = useState(false);
  
  const cartCount = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => 
    pathname === path ? "text-[var(--color-gold-primary)]" : "text-gray-900";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setShowProfileMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md shadow-sm relative">
      
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* MOBILE LAYOUT */}
        <div className="flex w-full items-center justify-between md:hidden relative">
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-gray-700 transition-colors hover:text-black"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img 
                src="/assets/Sinduri_Logo.PNG" 
                width={100} 
                height={20} 
                alt="Logo" 
                className="object-contain" 
              />
            </Link>
          </div>

          {session ? (
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-1">
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <User size={18} className="text-gray-600" />
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-medium text-sm text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings size={16} />
                        My Profile
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="p-2">
              <User size={24} className="text-gray-700" />
            </Link>
          )}
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden w-full items-center justify-between md:flex">
          
          <Link href="/" className="flex items-center">
            <img 
              src="/assets/Sinduri_Logo.PNG" 
              width={100} 
              height={20} 
              alt="Logo" 
              className="mt-2" 
            />
          </Link>

          <div className="flex gap-8 text-sm font-medium uppercase tracking-wide">
            <Link href="/products" className={`hover:text-[var(--color-gold-primary)] transition ${isActive("/products")}`}>
              Products
            </Link>
            <Link href="/wishlist" className={`hover:text-[var(--color-gold-primary)] transition ${isActive("/wishlist")}`}>
              Wishlist
            </Link>
            <Link href="/about" className={`hover:text-[var(--color-gold-primary)] transition ${isActive("/about")}`}>
              About
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* CART WITH COUNT BADGE */}
            <Link href="/cart" className="relative group hover:text-[var(--color-gold-primary)] transition">
              <ShoppingBag size={20} />
              {/* 🔥 ONLY RENDER BADGE AFTER HYDRATION */}
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold-primary)] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* WISHLIST WITH COUNT BADGE */}
            <Link href="/wishlist" className="relative group hover:text-[var(--color-gold-primary)] transition">
              <Heart size={20} />
              {/* 🔥 ONLY RENDER BADGE AFTER HYDRATION */}
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-1 pr-3 py-1 text-sm font-medium text-gray-700 transition hover:border-[var(--color-gold-primary)] hover:bg-gray-50"
                >
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={14} />
                    </div>
                  )}
                  <span>{session.user?.name?.split(" ")[0] || "Account"}</span>
                </button>

                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-medium text-sm text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link 
                          href="/profile" 
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings size={16} />
                          My Profile
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div 
        className={`
          absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden
          transition-all duration-300 ease-in-out origin-top z-40
          ${isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-5 invisible pointer-events-none"}
        `}
      >
        <div className="flex flex-col p-4 space-y-4 font-medium text-gray-900">
          
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full rounded-lg bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-black border border-gray-200"
            />
          </div>

          <Link 
            href="/products" 
            className="flex items-center gap-3 py-2 hover:text-[var(--color-gold-primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingBag size={18} /> Shop Collection
          </Link>
          
          <Link 
            href="/wishlist" 
            className="flex items-center justify-between py-2 hover:text-[var(--color-gold-primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <Heart size={18} /> My Wishlist
            </span>
            {/* 🔥 ONLY RENDER BADGE AFTER HYDRATION */}
            {mounted && wishlistCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link 
            href="/cart" 
            className="flex items-center justify-between py-2 hover:text-[var(--color-gold-primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag size={18} /> My Cart
            </span>
            {/* 🔥 ONLY RENDER BADGE AFTER HYDRATION */}
            {mounted && cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold-primary)] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {session && (
            <>
              <Link 
                href="/profile" 
                className="flex items-center gap-3 py-2 border-t border-gray-100 pt-4 hover:text-[var(--color-gold-primary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} /> My Profile
              </Link>
              <button 
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
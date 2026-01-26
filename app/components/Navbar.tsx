"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ShoppingBag, Heart, User, Search, LogOut, Settings, ChevronRight } from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 FIX: Prevent hydration mismatch by only showing counts after mount
  const [mounted, setMounted] = useState(false);
  
  const cartCount = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.totalItems());
  
  // 🔥 Get logout handlers
  const clearCart = useCartStore((state) => state.handleLogout);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    // Use window.location for navigation instead of useRouter
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const isActive = (path: string) => 
    pathname === path ? "text-[var(--color-gold-primary)]" : "text-gray-900";

  // 🔥 FIXED LOGOUT HANDLER
  const handleSignOut = async () => {
    console.log("🚪 Logging out and clearing data...");
    
    // Clear stores BEFORE signing out
    clearCart();
    clearWishlist();
    
    // Close menus
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
    
    // Sign out
    await signOut({ callbackUrl: "/" });
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
        <div className="hidden md:flex items-center gap-8">
          {["Products", "Wishlist", "About"].map((item) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase()}`}
              className={`relative text-sm font-medium uppercase tracking-widest transition-colors duration-300 hover:text-[var(--color-gold-primary)] 
                ${isActive(`/${item.toLowerCase()}`) ? "text-[var(--color-gold-primary)]" : "text-gray-600"}`}
            >
              {item}
              {isActive(`/${item.toLowerCase()}`) && (
                <motion.div 
                  layoutId="underline" 
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--color-gold-primary)]" 
                />
              )}
            </Link>
          ))}
        </div>

        {/* ================= RIGHT ICONS & ACTIONS ================= */}
        <div className="flex items-center gap-2 md:gap-5">
          
          {/* DESKTOP SEARCH BAR */}
          <div className="hidden md:flex items-center">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="relative overflow-hidden"
                >
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Search jewellery..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-4 pr-8 text-sm focus:outline-none focus:border-[var(--color-gold-primary)]"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-gold-primary)]">
                    <ChevronRight size={14} />
                  </button>
                </motion.form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-[var(--color-gold-primary)] transition rounded-full hover:bg-gray-50"
                >
                  <Search size={20} />
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* WISHLIST */}
          <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-[var(--color-gold-primary)] transition hidden md:block">
            <Heart size={20} />
            {mounted && wishlistCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-[var(--color-gold-primary)] transition">
            <ShoppingBag size={20} />
            {mounted && cartCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-[var(--color-gold-primary)] text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* PROFILE / LOGIN */}
          {session ? (
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition"
              >
                <img 
                  src={session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full border border-gray-200 object-cover"
                />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="font-semibold text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition" onClick={() => setShowProfileMenu(false)}>
                          <User size={16} /> My Profile
                        </Link>
                        <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition" onClick={() => setShowProfileMenu(false)}>
                          <ShoppingBag size={16} /> My Orders
                        </Link>
                        <button 
                          onClick={handleSignOut} 
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:flex items-center gap-2 px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-800 transition shadow-md">
              Sign In
            </Link>
          )}
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
                onClick={handleSignOut}
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

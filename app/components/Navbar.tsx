"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Menu, X, ShoppingBag, Heart, User, Search, LogOut, House, Handshake, Gem
} from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { data: session, status } = useSession(); // 🔥 GET AUTH STATUS
  const router = useRouter();
  const pathname = usePathname();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartCount = useCartStore((state) => state.items.length);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const isActive = (path: string) => pathname === path;
  
  const handleSignOut = async () => {
     setShowProfileMenu(false);
     setIsMobileMenuOpen(false);
     await signOut();
  };

  // 🔥 CHECK IF USER IS AUTHENTICATED
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* ================= MOBILE TOGGLE ================= */}
        <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* ================= LOGO ================= */}
        <div className="shrink-0 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 ">
            <Link href="/" className="block">
              <img
                src="/assets/Sinduri_Logo.PNG" 
                alt="Sinduri"
                height={10} 
                width={100}
                className="object-contain hover:opacity-90 transition-opacity mt-5 mb-2"
              />
            </Link>
        </div>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center gap-8">
              {["Products", "Wishlist", "About"].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`relative text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-200
                    ${isActive(`/${item.toLowerCase()}`) ? "text-(--color-gold-primary)" : "text-gray-600 hover:text-black"}`}
                >
                  {item}
                  {isActive(`/${item.toLowerCase()}`) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-(--color-gold-primary)" />
                  )}
                </Link>
              ))}
            </div>
        </div>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-3 md:gap-6">
            
            {/* DESKTOP SEARCH BAR */}
            

            <div className="flex items-center gap-4 md:border-l md:border-gray-200 md:pl-6 h-6">
                
                {/* 🔥 WISHLIST - ONLY SHOW BADGE WHEN AUTHENTICATED */}
                <Link href="/wishlist" className="relative group text-gray-500 hover:text-black transition-colors hidden md:block">
                  <Heart size={20} className="group-hover:scale-105 transition-transform" />
                  {mounted && isAuthenticated && wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* 🔥 CART - ONLY SHOW BADGE WHEN AUTHENTICATED */}
                <Link href="/cart" className="relative group text-gray-500 hover:text-black transition-colors">
                  <ShoppingBag size={20} className="group-hover:scale-105 transition-transform" />
                  {mounted && isAuthenticated && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-(--color-gold-primary) text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* PROFILE DROPDOWN */}
                <div className="relative hidden md:block">
                  {session ? (
                    <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
                      <img 
                        src={session.user?.image || "https://ui-avatars.com/api/?background=random&name=" + session.user?.name} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full border border-gray-200 hover:border-(--color-gold-primary) transition-colors object-cover"
                      />
                    </button>
                  ) : (
                    <Link href="/auth/login" className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white hover:bg-(--color-gold-primary) transition-colors">
                       <User size={16} />
                    </Link>
                  )}

                  <AnimatePresence>
                    {showProfileMenu && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden"
                        >
                          <div className="p-1">
                            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setShowProfileMenu(false)}>
                              <User size={15} /> Profile
                            </Link>
                            <Link href="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setShowProfileMenu(false)}>
                              <ShoppingBag size={15} /> Orders
                            </Link>
                            <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg text-left">
                              <LogOut size={15} /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
            </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`
          absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden
          transition-all duration-300 ease-in-out origin-top z-40
          ${isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-5 invisible pointer-events-none"}
        `}
      >
        <div className="flex flex-col p-4 space-y-4 font-medium text-gray-900">
          
         <Link href="/"
         className="flex items-center gap-3 py-2 hover:text-(--color-gold-primary) transition-colors"
         onClick={() => setIsMobileMenuOpen(false)}>
          <House size={18}/> Home
         </Link> 
          

          <Link
            href="/products"
            className="flex items-center gap-3 py-2 hover:text-(--color-gold-primary) transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingBag size={18} /> Shop Collection
          </Link>
          
          {/* 🔥 MOBILE WISHLIST - ONLY SHOW COUNT WHEN AUTHENTICATED */}
          <Link
            href="/wishlist"
            className="flex items-center justify-between py-2 hover:text-(--color-gold-primary) transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <Heart size={18} /> My Wishlist
            </span>
            {mounted && isAuthenticated && wishlistCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 🔥 MOBILE CART - ONLY SHOW COUNT WHEN AUTHENTICATED */}
          <Link
            href="/cart"
            className="flex items-center justify-between py-2 hover:text-(--color-gold-primary) transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag size={18} /> My Cart
            </span>
            {mounted && isAuthenticated && cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--color-gold-primary) text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-3 py-2 border-t border-gray-100 pt-4 hover:text-(--color-gold-primary) transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} /> My Profile
              </Link>
              <Link 
                href="/about"
                className="flex items-center gap-3 py-2 border-t border-gray-100 pt-4 hover:text-(--color-gold-primary) transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Gem size={18} />About Us
              </Link>

              <Link 
                href="/wholesale"
                className="flex items-center gap-3 py-2 border-t border-gray-100 pt-4 hover:text-(--color-gold-primary) transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Handshake size={18} />Wholesale Details
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <Link
                href="/auth/login"
                className="flex items-center gap-3 py-2 border-t border-gray-100 pt-4 hover:text-(--color-gold-primary) transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} /> Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ShoppingBag, Heart, User, Search } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper to highlight active link
  const isActive = (path: string) => 
    pathname === path ? "text-[var(--color-gold-primary)]" : "text-gray-900";

  return (
    // 'relative' is needed here so the absolute menu positions itself relative to this nav
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md shadow-sm relative">
      
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* ==================== MOBILE LAYOUT (Visible < md) ==================== */}
        <div className="flex w-full items-center justify-between md:hidden relative">
          
          {/* 1. HAMBURGER MENU (Left) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-gray-700 transition-colors hover:text-black"
          >
            {/* Simple fade/rotation transition for icon could go here, keeping it simple for now */}
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} className="cursor-pointer" />}
          </button>

          {/* 2. LOGO (Centered Absolutely) */}
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

          {/* 3. PROFILE / AUTH (Right) */}
          {session ? (
             <Link href="/profile">
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
             </Link>
          ) : (
             <Link href="/auth/login" className="p-2">
                <User size={24} className="text-gray-700" />
             </Link>
          )}
        </div>

        {/* ==================== DESKTOP LAYOUT (Visible >= md) ==================== */}
        <div className="hidden w-full items-center justify-between md:flex">
          
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center">
            <img 
               src="/assets/Sinduri_Logo.PNG" 
               width={100} 
               height={20} 
               alt="Logo" 
               className="mt-2" 
            />
          </Link>

          {/* CENTER: Navigation Links */}
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

          {/* RIGHT: Icons & Auth */}
          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative group hover:text-[var(--color-gold-primary)] transition">
              <ShoppingBag size={20} />
            </Link>
            
            {session ? (
              <Link 
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-1 pr-3 py-1 text-sm font-medium text-gray-700 transition hover:border-[var(--color-gold-primary)] hover:bg-gray-50"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={14} />
                  </div>
                )}
                <span>{session.user?.name?.split(" ")[0] || "Account"}</span>
              </Link>
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

      {/* ==================== MOBILE MENU DROPDOWN ==================== */}
      {/* 1. 'absolute': Takes it out of flow so it overlays content 
          2. 'top-full': Starts exactly at the bottom of the navbar
          3. Transitions: We toggle opacity and translate-y to make it smooth
          4. 'pointer-events-none': Prevents clicking when invisible
      */}
      <div 
        className={`
          absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden
          transition-all duration-300 ease-in-out origin-top z-40
          ${isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-5 invisible pointer-events-none"}
        `}
      >
        <div className="flex flex-col p-4 space-y-4 font-medium text-gray-900">
          
          {/* Search Bar */}
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
            className="flex items-center gap-3 py-2 hover:text-[var(--color-gold-primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Heart size={18} /> My Wishlist
          </Link>

          <Link 
            href="/cart" 
            className="flex items-center gap-3 py-2 hover:text-[var(--color-gold-primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingBag size={18} /> My Cart
          </Link>

          {session && (
            <Link 
              href="/profile" 
              className="flex items-center gap-3 py-2 border-t border-gray-100 pt-4 hover:text-[var(--color-gold-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
               <User size={18} /> My Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
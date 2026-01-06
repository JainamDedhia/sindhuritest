"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Settings, Heart, ShoppingBag } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ FIX 3: Proper sign out handler
  const handleSignOut = async () => {
    if (!confirm("Are you sure you want to sign out?")) return;
    
    try {
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      });
    } catch (error) {
      console.error("❌ Sign out error:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container h-full flex items-center justify-between">
        
        {/* LEFT: Logo/Brand */}
        <Link href="/" className="flex items-center">
          <img src="/assets/Sinduri_Logo.PNG" width={100} height={20} className="mt-4" alt="Logo" />
        </Link>

        {/* RIGHT: Navigation + Auth */}
        <div className="flex items-center gap-6">
          {/* Main navigation links */}
          <Link 
            href="/products" 
            className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition"
          >
            Products
          </Link>
          
          <Link 
            href="/wishlist" 
            className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition"
          >
            Wishlist
          </Link>
          
          <Link 
            href="/cart" 
            className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition"
          >
            Cart
          </Link>

          {/* Profile/Auth Section */}
          {status === "loading" ? (
            <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
          ) : session ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-yellow-600 hover:bg-gray-50"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-600/10">
                    <User size={14} className="text-yellow-600" />
                  </div>
                )}
                <span className="hidden sm:inline">
                  {session.user?.name?.split(" ")[0] || "Profile"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                  {/* User Info */}
                  <div className="border-b border-gray-100 p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                    {session.user?.phone && (
                      <p className="mt-1 text-xs text-gray-400">📱 {session.user.phone}</p>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <Settings size={16} />
                      My Profile
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <Heart size={16} />
                      Wishlist
                    </Link>

                    <Link
                      href="/cart"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <ShoppingBag size={16} />
                      Shopping Cart
                    </Link>
                  </div>

                  {/* ✅ FIX 4: Sign Out Button */}
                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
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
    </nav>
  );
}
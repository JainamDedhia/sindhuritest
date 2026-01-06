"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full h-16 bg-white border-b border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
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
            className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--color-gold-primary)] transition"
          >
            Products
          </Link>
          
          <Link 
            href="/wishlist" 
            className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--color-gold-primary)] transition"
          >
            Wishlist
          </Link>
          
          <Link 
            href="/cart" 
            className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--color-gold-primary)] transition"
          >
            Cart
          </Link>

          {/* Profile/Auth Section */}
          {session ? (
            <Link 
              href="/profile"
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-[var(--color-gold-primary)] hover:bg-gray-50"
            >
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <User size={16} />
              )}
              <span className="hidden sm:inline">
                {session.user?.name?.split(" ")[0] || "Profile"}
              </span>
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
    </nav>
  );
}
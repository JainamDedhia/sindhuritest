"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, ShoppingBag, Heart } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
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

  if (status === "loading") {
    return <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-[var(--color-gold-primary)] hover:bg-gray-50"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt="Profile"
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold-primary)]/10">
            <User size={14} className="text-[var(--color-gold-primary)]" />
          </div>
        )}
        <span className="hidden sm:inline">
          {session.user?.name?.split(" ")[0] || "Profile"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* User Info */}
          <div className="border-b border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-900">
              {session.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">{session.user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                router.push("/profile");
                setDropdownOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <Settings size={16} />
              My Profile
            </button>

            <button
              onClick={() => {
                router.push("/wishlist");
                setDropdownOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <Heart size={16} />
              Wishlist
            </button>

            <button
              onClick={() => {
                router.push("/cart");
                setDropdownOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <ShoppingBag size={16} />
              Shopping Cart
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
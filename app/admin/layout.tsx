"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Product Upload", href: "/admin/products" },
  { label: "Banner Upload", href: "/admin/banners" },
<<<<<<< Updated upstream
=======
  { label: "Manage Banners", href: "/admin/banners/manage"},
>>>>>>> Stashed changes
  { label: "Analytics", href: "/admin/analytics" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">

      {/* ===== MOBILE OVERLAY ===== */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-white border-r
        border-[var(--color-border)] px-6 py-8
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand */}
        <h1 className="text-xl font-semibold mb-10">
          Admin Panel
        </h1>

        {/* Nav */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-2.5 text-sm transition
                  ${
                    active
                      ? "bg-[var(--color-ivory)] font-medium text-[var(--foreground)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-ivory)]"
                  }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="lg:pl-64 flex flex-col min-h-screen">

        {/* TOP BAR (MOBILE) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-[var(--color-border)]">
          <div className="h-14 px-4 flex items-center justify-between">
            <button
              onClick={() => setOpen(true)}
              className="text-sm px-3 py-2 rounded-md border border-[var(--color-border)]"
            >
              Menu
            </button>

            <span className="text-sm font-medium">
              Admin
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

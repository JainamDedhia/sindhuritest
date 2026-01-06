"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Create Category" , href: "/admin/categories"},
  { label: "Product Upload", href: "/admin/products/add" },
  { label: "Product Management", href: "/admin/products"},
  { label: "Banner Upload", href: "/admin/banners" },
  { label: "Manage Banners", href: "/admin/banners/manage" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Gold Rate", href: "/admin/gold-rate"},
  { label: "Bento Layout", href: "/admin/bento"},
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    // Login page doesn't need auth check
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const adminSession = localStorage.getItem("admin_session");
    
    if (!adminSession) {
      // Redirect directly to admin login, not user login
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookie
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage and redirect
      localStorage.removeItem("admin_session");
      router.push("/admin/login");
    }
  };

  // Show login page WITHOUT any layout (no navbar, no footer)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-gold-primary)]" />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Admin Layout - FULL SCREEN (no navbar, no footer from root layout)
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--color-border)] bg-white px-6 py-8 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <h1 className="mb-10 text-xl font-semibold">Admin Panel</h1>

        {/* Nav */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-2.5 text-sm transition ${
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

        {/* Admin Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          <LogOut size={16} />
          Admin Logout
        </button>
      </aside>

      {/* MAIN AREA */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        
        {/* TOP BAR (MOBILE) */}
        <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
            >
              Menu
            </button>
            <span className="text-sm font-medium">Admin Panel</span>
          </div>
        </header>

        {/* CONTENT - Full height, no footer */}
        <main className="flex flex-1 justify-center">
          <div className="w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
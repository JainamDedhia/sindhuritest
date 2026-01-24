"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "../components/admin/Sidebar";// Import our new Sidebar
    // Import Breadcrumb

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // State for Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for Mobile Sidebar (Open/Close)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 1. AUTHENTICATION CHECK
  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const adminSession = localStorage.getItem("admin_session");
    
    if (!adminSession) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [pathname, router]);

  // 2. RENDER: Login Page (No Layout)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 3. RENDER: Loading Spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-gold-primary)]" />
      </div>
    );
  }

  // 4. RENDER: Main Admin Layout
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* === SIDEBAR (Desktop: Fixed, Mobile: Hidden by default) === */}
      {/* We pass a prop to control mobile visibility if needed, or wrap it for mobile logic */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:translate-x-0
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <AdminSidebar />
      </div>

      {/* === MOBILE OVERLAY (Click to close sidebar) === */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* === MAIN CONTENT AREA === */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen transition-all duration-300">
        
        {/* TOP BAR (Mobile Only - To Open Menu) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
          <span className="font-serif font-bold text-gray-800">SINDURI ADMIN</span>
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* DESKTOP HEADER (Optional - Shows Breadcrumb or Title) */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 shadow-sm">
           <h2 className="text-sm font-medium text-gray-500">Welcome back, Admin</h2>
           {/* You could add a Notification bell or Profile dropdown here later */}
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            
            {/* Breadcrumb Navigation */}
            
            {/* The Page Content */}
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
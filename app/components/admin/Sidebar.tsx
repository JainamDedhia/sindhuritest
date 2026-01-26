"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Shapes,
  PlusSquare,
  Presentation,
  ImagePlus,
  Layers,
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  List, 
  Settings, 
  ChevronRight, 
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isProductsOpen, setIsProductsOpen] = useState(
    pathname.startsWith("/admin/products")
  );
  const [isBannersOpen, setIsBannersOpen] = useState(
    pathname.startsWith("/admin/banners")
  );

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem("admin_session");
      router.push("/admin/login");
    }
  };

  const menuAnimation = {
    closed: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
    open: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  // ✅ FIXED: Proper type for Framer Motion transition
  const hoverTransition = { 
    type: "spring" as const, 
    stiffness: 400, 
    damping: 17 
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-neutral-950 text-gray-400 fixed left-0 top-0 border-r border-white/5 z-50">
      
      {/* 1. BRANDING */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-neutral-950">
        <span className="text-xl font-serif font-bold text-white tracking-widest">
          SINDURI <span className="text-[var(--color-gold-primary)]">ADMIN</span>
        </span>
      </div>

      {/* 2. NAVIGATION */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-800">
        
        {/* DASHBOARD */}
        <Link href="/admin/analytics">
          <motion.div 
            whileHover={{ x: 5 }} 
            transition={hoverTransition}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive("/admin/analytics") 
                ? "bg-[var(--color-gold-primary)]/10 text-[var(--color-gold-primary)] font-medium border-l-2 border-[var(--color-gold-primary)]" 
                : "hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </motion.div>
        </Link>

        {/* === PRODUCTS GROUP === */}
        <div className="pt-2">
          <button
            onClick={() => setIsProductsOpen(!isProductsOpen)}
            className={`flex w-full items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
               isProductsOpen ? "text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className={isProductsOpen ? "text-[var(--color-gold-primary)]" : "group-hover:text-[var(--color-gold-primary)] transition-colors"} />
              <span className="font-medium">Products</span>
            </div>
            
            <motion.div animate={{ rotate: isProductsOpen ? 90 : 0 }}>
              <ChevronRight size={16} />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isProductsOpen && (
              <motion.div
                key="content"
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuAnimation}
                className="overflow-hidden"
              >
                <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                  
                  {/* Upload Products */}
                  <Link href="/admin/products/add">
                    <motion.div 
                      whileHover={{ x: 5 }} 
                      transition={hoverTransition}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        isActive("/admin/products/add") 
                           ? "text-[var(--color-gold-primary)] bg-[var(--color-gold-primary)]/10 font-medium" 
                           : "text-gray-500 hover:text-gray-200"
                      }`}
                    >
                      <PlusCircle size={18} />
                      <span>Upload Product</span>
                    </motion.div>
                  </Link>

                  {/* Inventory List */}
                  <Link href="/admin/products">
                    <motion.div 
                       whileHover={{ x: 5 }} 
                       transition={hoverTransition}
                       className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        isActive("/admin/products") 
                           ? "text-[var(--color-gold-primary)] bg-[var(--color-gold-primary)]/10 font-medium" 
                           : "text-gray-500 hover:text-gray-200"
                      }`}
                    >
                      <List size={18} />
                      <span>Inventory List</span>
                    </motion.div>
                  </Link>

                  <Link href="/admin/categories">
                    <motion.div 
                       whileHover={{ x: 5 }} 
                       transition={hoverTransition}
                       className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        isActive("/admin/categories") 
                           ? "text-[var(--color-gold-primary)] bg-[var(--color-gold-primary)]/10 font-medium" 
                           : "text-gray-500 hover:text-gray-200"
                      }`}
                    >
                      <PlusSquare size={18} />
                      <span>Manage Categories</span>
                    </motion.div>
                  </Link>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === BANNERS GROUP === */}
        <div className="pt-2">
          <button
            onClick={() => setIsBannersOpen(!isBannersOpen)}
            className={`flex w-full items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
               isBannersOpen ? "text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Presentation size={20} className={isBannersOpen ? "text-[var(--color-gold-primary)]" : "group-hover:text-[var(--color-gold-primary)] transition-colors"} />
              <span className="font-medium">Banners</span>
            </div>
            
            <motion.div animate={{ rotate: isBannersOpen ? 90 : 0 }}>
              <ChevronRight size={16} />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isBannersOpen && (
              <motion.div
                key="banner-content"
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuAnimation}
                className="overflow-hidden"
              >
                <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                  
                  {/* Upload Banners */}
                  <Link href="/admin/banners">
                    <motion.div 
                      whileHover={{ x: 5 }} 
                      transition={hoverTransition}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        isActive("/admin/banners") 
                           ? "text-[var(--color-gold-primary)] bg-[var(--color-gold-primary)]/10 font-medium" 
                           : "text-gray-500 hover:text-gray-200"
                      }`}
                    >
                      <ImagePlus size={18} />
                      <span>Upload Banner</span>
                    </motion.div>
                  </Link>

                  {/* Manage Banners */}
                  <Link href="/admin/banners/manage">
                    <motion.div 
                        whileHover={{ x: 5 }} 
                        transition={hoverTransition}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        isActive("/admin/banners/manage") 
                           ? "text-[var(--color-gold-primary)] bg-[var(--color-gold-primary)]/10 font-medium" 
                           : "text-gray-500 hover:text-gray-200"
                      }`}
                    >
                      <Layers size={18} />
                      <span>Manage Banners</span>
                    </motion.div>
                  </Link>

                  <Link href="/admin/bento">
                    <motion.div 
                       whileHover={{ x: 5 }} 
                       transition={hoverTransition}
                       className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        isActive("/admin/categories") 
                           ? "text-[var(--color-gold-primary)] bg-[var(--color-gold-primary)]/10 font-medium" 
                           : "text-gray-500 hover:text-gray-200"
                      }`}
                    >
                      <PlusSquare size={18} />
                      <span>Bento Grid</span>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SETTINGS */}
        <Link href="/admin/gold-rate">
          <motion.div 
            whileHover={{ x: 5 }} 
            transition={hoverTransition}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive("/admin/gold-rate") 
                ? "bg-[var(--color-gold-primary)]/10 text-[var(--color-gold-primary)] font-medium border-l-2 border-[var(--color-gold-primary)]" 
                : "hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings size={20} />
            <span>GoldRates</span>
          </motion.div>
        </Link>
      </div>

      {/* 3. LOGOUT */}
      <div className="p-4 border-t border-white/5 bg-neutral-950">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}

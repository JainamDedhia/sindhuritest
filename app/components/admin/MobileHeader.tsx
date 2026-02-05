"use client";

import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

export default function MobileAdminHeader({ onOpenSidebar }: MobileHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
      <span className="font-serif font-bold text-gray-800">SINDURI ADMIN</span>
      <button 
        onClick={onOpenSidebar}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
import { create } from "zustand";

interface UIStore {
  // Mobile menu
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  
  // Modals
  isFilterModalOpen: boolean;
  setFilterModalOpen: (isOpen: boolean) => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  
  // Toast notifications
  toast: {
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  };
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
  
  // Product quick view
  quickViewProduct: string | null;
  setQuickViewProduct: (productId: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Mobile menu state
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  // Filter modal
  isFilterModalOpen: false,
  setFilterModalOpen: (isOpen) => set({ isFilterModalOpen: isOpen }),
  
  // Loading
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  
  // Toast
  toast: {
    message: "",
    type: "info",
    isVisible: false,
  },
  showToast: (message, type = "info") => {
    set({
      toast: {
        message,
        type,
        isVisible: true,
      },
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toast: { ...state.toast, isVisible: false },
      }));
    }, 3000);
  },
  hideToast: () => set((state) => ({ toast: { ...state.toast, isVisible: false } })),
  
  // Quick view
  quickViewProduct: null,
  setQuickViewProduct: (productId) => set({ quickViewProduct: productId }),
}));
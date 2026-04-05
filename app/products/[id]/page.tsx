"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
  Check,
  Loader2,
  Share2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useUIStore } from "@/app/store/uiStore";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // 🔥 NEW: Image carousel state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const [expandedSection, setExpandedSection] = useState<string | null>("details");

  const ADMIN_PHONE = "918668679249";

  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const showToast = useUIStore((state) => state.showToast);

  const isInCart = product ? cartItems.some(item => item.id === product.id) : false;

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  // 🔥 Image navigation handlers
  const images = product?.all_images || [product?.image_url].filter(Boolean) || [];
  
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = async () => {
    if (!session) {
      showToast("Please sign in to shop", "info");
      setTimeout(() => router.push("/auth/login?callbackUrl=" + window.location.pathname), 1000);
      return;
    }
    if (product.is_sold_out) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        title: product.name,
        category: product.category_name || "Jewellery",
        description: product.description || "",
        weight: parseFloat(product.weight),
        image: product.image_url,
        inStock: !product.is_sold_out,
      });
      showToast("Added to your cart", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to add", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = () => {
    if (!session) {
      showToast("Sign in to save items", "info");
      return;
    }
    if (!product) return;
    
    const isWishlisted = useWishlistStore.getState().isWishlisted(product.id);
    toggleWishlist({
      id: product.id,
      title: product.name,
      category: product.category_name,
      description: product.description,
      weight: product.weight,
      image: product.image_url,
      inStock: !product.is_sold_out,
    });
    showToast(isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist", "success");
  };

  const handleEnquire = () => {
    if (!product) return;
    const msg = `Hi, I'm interested in *${product.name}* (Code: ${product.product_code})`;
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const renderDescription = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => (
      <span key={index} className="block mb-2 text-gray-600 leading-relaxed">
        {line}
      </span>
    ));
  };

  const isWishlisted = product ? useWishlistStore.getState().isWishlisted(product.id) : false;

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-[var(--color-gold-primary)]" />
    </div>
  );
  
  if (!product) return (
    <div className="h-screen flex items-center justify-center">Product Not Found</div>
  );

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-0">
      
      {/* HEADER */}
      <div className="container mx-auto px-4 py-6 border-b border-gray-50">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Collection
        </button>
      </div>

      <main className="container mx-auto px-4 lg:px-8 mt-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ================= LEFT: IMAGE GALLERY (STICKY) ================= */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-4">
              
              {/* 🔥 MAIN IMAGE DISPLAY WITH CAROUSEL */}
              <div className="aspect-square w-full overflow-hidden bg-[#F9F9F9] rounded-sm relative group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={images[selectedImageIndex] || "/placeholder.jpg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation Arrows (only show if multiple images) */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronLeft size={20} className="text-gray-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronRight size={20} className="text-gray-900" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.is_sold_out && (
                    <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* 🔥 THUMBNAIL GALLERY (only show if multiple images) */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        idx === selectedImageIndex
                          ? "border-[var(--color-gold-primary)] opacity-100"
                          : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT: DETAILS (Same as before) ================= */}
          <div className="lg:col-span-5 flex flex-col pt-2">
            
            {/* Header Info */}
            <div className="border-b border-gray-100 pb-8">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[var(--color-gold-primary)] uppercase">
                {product.category_name || "Fine Jewellery"}
              </span>
              <h1 className="mt-3 text-3xl lg:text-4xl font-serif text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="mt-6 flex items-end justify-between">
                 <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Net Weight</p>
                    <p className="text-2xl font-serif text-gray-900">{product.weight}g</p>
                 </div>
                 <button className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50">
                    <Share2 size={18} />
                 </button>
              </div>
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden lg:flex flex-col gap-3 py-8">
              <div className="flex gap-3">
                {isInCart ? (
                  <button
                    onClick={() => router.push('/cart')}
                    className="flex-1 h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest bg-green-600 text-white hover:bg-green-700 transition-all"
                  >
                    <Check size={16} />
                    View Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.is_sold_out || isAddingToCart}
                    className={`flex-1 h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all
                      ${product.is_sold_out 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-black"
                      }`}
                  >
                    {isAddingToCart ? <Loader2 className="animate-spin" size={16} /> : <ShoppingBag size={16} />}
                    {product.is_sold_out ? "Sold Out" : "Add to Cart"}
                  </button>
                )}

                <button 
                  onClick={handleToggleWishlist}
                  className="h-12 w-12 flex items-center justify-center border border-gray-200 hover:border-black transition-colors"
                >
                  <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-900"} />
                </button>
              </div>
              
              <button 
                onClick={handleEnquire}
                className="h-12 w-full flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-gold-primary)] border border-[var(--color-gold-primary)] hover:bg-[var(--color-gold-primary)] hover:text-white transition-colors uppercase tracking-widest"
              >
                <MessageCircle size={16} /> Enquire via WhatsApp
              </button>
            </div>

            {/* Details Accordions */}
            <div className="border-t border-gray-100">
               <AccordionItem 
                 title="Product Description" 
                 isOpen={expandedSection === 'details'} 
                 onClick={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
               >
                  <div className="text-sm">
                     {renderDescription(product.description)}
                     
                     <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-500">
                        <span>Product Code:</span> <span className="text-gray-900">{product.product_code}</span>
                     </div>
                  </div>
               </AccordionItem>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-gray-100">
               <TrustBadge icon={Shield} label="BIS Hallmarked" />
               <TrustBadge icon={Truck} label="Insured Shipping" />
               <TrustBadge icon={RotateCcw} label="Easy Returns" />
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 lg:hidden z-50 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleEnquire}
          className="flex-1 h-12 flex items-center justify-center border border-gray-200 text-gray-900 font-bold uppercase text-[10px] tracking-wider"
        >
          Enquire
        </button>
        {isInCart ? (
          <button
            onClick={() => router.push('/cart')}
            className="flex-[2] h-12 flex items-center justify-center gap-2 bg-green-600 text-white font-bold uppercase text-[10px] tracking-wider"
          >
            View Cart
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.is_sold_out}
            className={`flex-[2] h-12 flex items-center justify-center gap-2 text-white font-bold uppercase text-[10px] tracking-wider
              ${product.is_sold_out ? "bg-gray-400" : "bg-gray-900"}`}
          >
            {product.is_sold_out ? "Sold Out" : "Add to Cart"}
          </button>
        )}
      </div>

    </div>
  );
}

// Helper Components
function AccordionItem({ title, isOpen, onClick, children }: any) {
  return (
    <div className="border-b border-gray-100">
      <button 
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-medium text-sm text-gray-900 group-hover:text-[var(--color-gold-primary)] transition-colors uppercase tracking-wide">
          {title}
        </span>
        {isOpen ? <Minus size={14} className="text-gray-400" /> : <Plus size={14} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-gray-600">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrustBadge({ icon: Icon, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2 text-center group cursor-default">
       <div className="p-3 bg-gray-50 rounded-full group-hover:bg-[var(--color-gold-primary)]/10 transition-colors">
         <Icon size={18} className="text-gray-500 group-hover:text-[var(--color-gold-primary)] transition-colors"/>
       </div>
       <span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
         {label}
       </span>
    </div>
  );
}
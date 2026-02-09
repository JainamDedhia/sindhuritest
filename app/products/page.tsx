"use client";

import { Suspense, useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";
import { X, SlidersHorizontal, Search, Check, Trash2, Tag } from "lucide-react";

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  weight: string;
  is_sold_out: boolean;
  category_id: string; 
  image: string;
}

interface Category {
  id: string;
  name: string;
}

function ProductContent() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // FILTER STATE
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "soldOut">("all");
  const [sortBy, setSortBy] = useState<"newest" | "nameAsc" | "nameDesc" | "weightAsc" | "weightDesc">("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (!prodRes.ok) throw new Error("Failed to Fetch Products");
        const prodData = await prodRes.json();
        setProducts(prodData);

        const catRes = await fetch('/api/categories');
        if (!catRes.ok) throw new Error("Failed to Fetch Categories");
        const catData = await catRes.json();
        setCategories(catData);
      } catch (error) {
        console.error("Error Loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setStockFilter("all");
    setSortBy("newest");
    setSearchQuery("");
  };

  let filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(query) ||
      (product.category_id || "").toLowerCase().includes(query);

    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(product.category_id);

    const matchesStock = 
      stockFilter === "all" ||
      (stockFilter === "inStock" && !product.is_sold_out) ||
      (stockFilter === "soldOut" && product.is_sold_out);

    return matchesSearch && matchesCategory && matchesStock;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "nameAsc": return a.name.localeCompare(b.name);
      case "nameDesc": return b.name.localeCompare(a.name);
      case "weightAsc": return parseFloat(a.weight) - parseFloat(b.weight);
      case "weightDesc": return parseFloat(b.weight) - parseFloat(a.weight);
      case "newest": default: return 0;
    }
  });

  const activeFiltersCount = selectedCategories.length + (stockFilter !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER */}
      <div className="bg-gray-50 py-12 text-center border-b border-gray-100">
        <h1 className="font-serif text-3xl font-medium text-gray-900">Our Collection</h1>
        <p className="mx-auto mt-2 text-sm text-gray-500">Curated elegance for every occasion.</p>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        
        {/* SEARCH & FILTER BAR */}
        <div className="mb-8 flex items-center justify-center gap-3 max-w-2xl mx-auto sticky top-4 z-10 md:static">
          <div className="relative group flex-1 shadow-sm md:shadow-none rounded-full">
            <input
              type="text"
              placeholder="Search for rings, gold..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full py-3 pl-10 md:pl-6 pr-10 text-base md:text-sm text-gray-900 outline-none shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-[var(--color-gold-primary)] focus:ring-1 focus:ring-[var(--color-gold-primary)]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-2">
                <X size={16} />
              </button>
            )}
            <div className="absolute left-3.5 md:right-4 md:left-auto top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-gold-primary)] transition-colors pointer-events-none">
              <Search size={20} />
            </div>
          </div>

          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:border-[var(--color-gold-primary)] hover:text-[var(--color-gold-primary)] transition-all shadow-sm active:bg-gray-50"
          >
            <SlidersHorizontal size={18} />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold-primary)] text-[10px] text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* ✨ IMPROVED ACTIVE FILTERS SECTION */}
        {/* ========================================================= */}
        {activeFiltersCount > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
                <div className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-2 min-w-max md:min-w-0">
                    
                    {/* Categories Chips - White with Gold Border */}
                    {selectedCategories.map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => toggleCategory(cat)} 
                        className="group flex items-center gap-1.5 rounded-full border border-[var(--color-gold-primary)] bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-gold-primary)] hover:bg-[var(--color-gold-primary)] hover:text-white transition-all shadow-sm"
                      >
                        {cat} <X size={12} className="opacity-60 group-hover:opacity-100" />
                      </button>
                    ))}

                    {/* Stock Chip - White with Blue Border */}
                    {stockFilter !== "all" && (
                      <button 
                        onClick={() => setStockFilter("all")} 
                        className="group flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        {stockFilter === "inStock" ? "In Stock" : "Sold Out"} 
                        <X size={12} className="opacity-60 group-hover:opacity-100" />
                      </button>
                    )}

                    {/* Divider for Visual Separation */}
                    <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

                    {/* ✨ NEW CLEAN "CLEAR ALL" BUTTON */}
                    <button 
                      onClick={clearFilters} 
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group border border-transparent hover:border-red-100 ml-1"
                    >
                      <Trash2 size={12} />
                      <span>Clear All</span>
                    </button>
                </div>
             </div>
          </div>
        )}

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="mt-4 rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-6">
             {filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    id: item.id,
                    title: item.name,
                    weight: item.weight,
                    category: item.category_id || "Jewelry",
                    description: item.description,
                    image: item.image || "https://placehold.co/400x500",
                    inStock: !item.is_sold_out,
                  }}
                />
             ))}
          </div>
        )}
      </div>

      {/* FILTER MODAL */}
      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />
          
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
                <div>
                   <h2 className="text-xl font-serif font-semibold text-gray-900">Filters</h2>
                   <p className="text-xs text-gray-500 mt-0.5">{filteredProducts.length} results found</p>
                </div>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                 
                 {/* Sort By */}
                 <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Sort By</h3>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                          { val: 'newest', label: 'Newest First' },
                          { val: 'nameAsc', label: 'Name (A-Z)' },
                          { val: 'weightAsc', label: 'Weight (Low-High)' },
                          { val: 'weightDesc', label: 'Weight (High-Low)' },
                       ].map((opt) => (
                          <button
                             key={opt.val}
                             onClick={() => setSortBy(opt.val as any)}
                             className={`px-4 py-3 rounded-lg text-sm font-medium text-left border transition-all ${
                                sortBy === opt.val 
                                ? 'border-[var(--color-gold-primary)] bg-[var(--color-gold-primary)]/5 text-[var(--color-gold-primary)]' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                             }`}
                          >
                             {opt.label}
                          </button>
                       ))}
                    </div>
                 </div>

                 <hr className="border-gray-100" />

                 {/* Categories */}
                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Categories</h3>
                       {selectedCategories.length > 0 && (
                          <button onClick={() => setSelectedCategories([])} className="text-xs font-medium text-[var(--color-gold-primary)] hover:underline">Reset</button>
                       )}
                    </div>
                    
                    <div className="space-y-1">
                       {categories.map((category) => {
                          const isSelected = selectedCategories.includes(category.name);
                          const count = products.filter(p => p.category_id === category.name).length;
                          
                          return (
                             <label key={category.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                                <div className="flex items-center gap-3">
                                   <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                      isSelected ? 'bg-[var(--color-gold-primary)] border-[var(--color-gold-primary)]' : 'border-gray-300 bg-white group-hover:border-gray-400'
                                   }`}>
                                      {isSelected && <Check size={12} className="text-white" />}
                                   </div>
                                   <span className={`text-sm ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                      {category.name}
                                   </span>
                                </div>
                                <span className="text-xs text-gray-400">{count}</span>
                                <input 
                                   type="checkbox" 
                                   className="hidden" 
                                   checked={isSelected} 
                                   onChange={() => toggleCategory(category.name)} 
                                />
                             </label>
                          );
                       })}
                    </div>
                 </div>

                 <hr className="border-gray-100" />

                 {/* Availability */}
                 <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Availability</h3>
                    <div className="space-y-2">
                       {[
                          { val: 'all', label: 'Show All Items' },
                          { val: 'inStock', label: 'In Stock Only' },
                       ].map((opt) => (
                          <label key={opt.val} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group">
                             <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                stockFilter === opt.val ? 'border-[var(--color-gold-primary)]' : 'border-gray-300 group-hover:border-gray-400'
                             }`}>
                                {stockFilter === opt.val && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-gold-primary)]" />}
                             </div>
                             <span className={`text-sm ${stockFilter === opt.val ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                {opt.label}
                             </span>
                             <input 
                                type="radio" 
                                className="hidden" 
                                checked={stockFilter === opt.val} 
                                onChange={() => setStockFilter(opt.val as any)} 
                             />
                          </label>
                       ))}
                    </div>
                 </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 absolute bottom-0 w-full z-20">
                 <div className="flex gap-4">
                    <button 
                       onClick={clearFilters}
                       className="flex-1 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                       Clear All
                    </button>
                    <button 
                       onClick={() => setIsFilterOpen(false)}
                       className="flex-1 py-3.5 rounded-xl bg-gray-900 text-sm font-semibold text-white shadow-lg hover:bg-black transition-all"
                    >
                       Show Results
                    </button>
                 </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage(){
  return(
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ProductContent />
    </Suspense>
  )
}
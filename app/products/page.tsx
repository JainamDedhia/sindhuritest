"use client";

import { Suspense, useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";
import SearchBar from "@/app/components/SearchBar";
import { X, SlidersHorizontal } from "lucide-react";

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  weight: string;
  is_sold_out: boolean;
  category_name: string;
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
  
  // 🔥 FILTER STATE
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "soldOut">("all");
  const [sortBy, setSortBy] = useState<"newest" | "nameAsc" | "nameDesc" | "weightAsc" | "weightDesc">("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const prodRes = await fetch('/api/products');
        if (!prodRes.ok) throw new Error("Failed to Fetch Products");
        const prodData = await prodRes.json();
        setProducts(prodData);

        // Fetch categories
        const catRes = await fetch('/api/categories');
        if (!catRes.ok) throw new Error("Failed to Fetch Categories");
        const catData = await catRes.json();
        setCategories(catData);
      } catch (error) {
        console.log("Error Loading data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔥 TOGGLE CATEGORY FILTER
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  // 🔥 CLEAR ALL FILTERS
  const clearFilters = () => {
    setSelectedCategories([]);
    setStockFilter("all");
    setSortBy("newest");
  };

  // 🔥 APPLY FILTERS
  let filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(query) ||
      (product.category_name || "").toLowerCase().includes(query);

    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(product.category_name);

    const matchesStock = 
      stockFilter === "all" ||
      (stockFilter === "inStock" && !product.is_sold_out) ||
      (stockFilter === "soldOut" && product.is_sold_out);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // 🔥 APPLY SORTING
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      case "weightAsc":
        return parseFloat(a.weight) - parseFloat(b.weight);
      case "weightDesc":
        return parseFloat(b.weight) - parseFloat(a.weight);
      case "newest":
      default:
        return 0; // Keep original order
    }
  });

  const activeFiltersCount = selectedCategories.length + (stockFilter !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER */}
      <div className="bg-gray-50 py-12 text-center border-b border-gray-100">
        <h1 className="font-serif text-3xl font-medium text-gray-900">
          Our Collection
        </h1>
        <p className="mx-auto mt-2 text-sm text-gray-500">
          Curated elegance for every occasion.
        </p>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        
        {/* SEARCH BAR */}
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          count={filteredProducts.length}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        {/* ACTIVE FILTERS CHIPS */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Active Filters:</span>
            
            {selectedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1 rounded-full bg-[var(--color-gold-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-gold-primary)] hover:bg-[var(--color-gold-primary)]/20 transition"
              >
                {cat}
                <X size={12} />
              </button>
            ))}

            {stockFilter !== "all" && (
              <button
                onClick={() => setStockFilter("all")}
                className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition"
              >
                {stockFilter === "inStock" ? "In Stock Only" : "Sold Out Only"}
                <X size={12} />
              </button>
            )}

            <button
              onClick={clearFilters}
              className="text-xs font-medium text-red-500 hover:text-red-600 underline"
            >
              Clear All
            </button>
          </div>
        )}

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Clear Filters
            </button>
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
                    category: item.category_name || "Jewelry",
                    description: item.description,
                    image: item.image || "https://placehold.co/400x500",
                    inStock: !item.is_sold_out,
                  }}
                />
             ))}
          </div>
        )}
      </div>

      {/* 🔥 FILTER MODAL */}
      {/* 🔥 CENTERED FILTER MODAL */}
{isFilterOpen && (
  <>
    {/* Backdrop with blur */}
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsFilterOpen(false)}
    />
    
    {/* ✨ CENTERED FILTER PANEL */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div 
        className="w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Gold Accent */}
        <div className="sticky top-0 bg-gradient-to-r from-white via-[var(--color-gold-primary)]/5 to-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-gold-primary)]/10">
              <SlidersHorizontal size={24} className="text-[var(--color-gold-primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-serif">Refine Your Search</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {activeFiltersCount > 0 ? `${activeFiltersCount} active filters` : 'No filters applied'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: CATEGORIES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Categories
                </h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {categories.length} total
                </span>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {categories.map((category) => {
                  const count = products.filter(p => p.category_name === category.name).length;
                  return (
                    <label
                      key={category.id}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                        selectedCategories.includes(category.name)
                          ? 'bg-[var(--color-gold-primary)]/10 border-2 border-[var(--color-gold-primary)] shadow-sm'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                        className="h-5 w-5 rounded border-gray-300 text-[var(--color-gold-primary)] focus:ring-[var(--color-gold-primary)]"
                      />
                      <span className="flex-1 text-sm font-medium text-gray-700">
                        {category.name}
                      </span>
                      <span className="text-xs font-semibold text-gray-400 bg-white px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: AVAILABILITY & SORTING */}
            <div className="space-y-8">
              
              {/* AVAILABILITY */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Availability
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Items", icon: "📦" },
                    { value: "inStock", label: "In Stock Only", icon: "✅" },
                    { value: "soldOut", label: "Sold Out", icon: "❌" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                        stockFilter === option.value
                          ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="stock"
                        checked={stockFilter === option.value}
                        onChange={() => setStockFilter(option.value as any)}
                        className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xl">{option.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SORT BY */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20"
                >
                  <option value="newest">✨ Newest First</option>
                  <option value="nameAsc">🔤 Name (A-Z)</option>
                  <option value="nameDesc">🔤 Name (Z-A)</option>
                  <option value="weightAsc">⚖️ Weight (Low to High)</option>
                  <option value="weightDesc">⚖️ Weight (High to Low)</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6 flex gap-4">
          <button
            onClick={clearFilters}
            className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Clear All Filters
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="flex-1 rounded-xl bg-gradient-to-r from-[var(--color-gold-primary)] to-[var(--color-gold-accent)] px-6 py-4 text-sm font-semibold text-white hover:shadow-lg transition-all"
          >
            View {filteredProducts.length} Products
          </button>
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
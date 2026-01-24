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
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Filter Panel */}
          <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={20} className="text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold-primary)] text-xs font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-6 space-y-8">
              
              {/* CATEGORIES */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                        className="h-4 w-4 rounded border-gray-300 text-[var(--color-gold-primary)] focus:ring-[var(--color-gold-primary)]"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        ({products.filter(p => p.category_name === category.name).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* STOCK STATUS */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Availability
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Items" },
                    { value: "inStock", label: "In Stock Only" },
                    { value: "soldOut", label: "Sold Out" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name="stock"
                        checked={stockFilter === option.value}
                        onChange={() => setStockFilter(option.value as any)}
                        className="h-4 w-4 border-gray-300 text-[var(--color-gold-primary)] focus:ring-[var(--color-gold-primary)]"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SORT BY */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="nameAsc">Name (A-Z)</option>
                  <option value="nameDesc">Name (Z-A)</option>
                  <option value="weightAsc">Weight (Low to High)</option>
                  <option value="weightDesc">Weight (High to Low)</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
              >
                View {filteredProducts.length} Items
              </button>
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
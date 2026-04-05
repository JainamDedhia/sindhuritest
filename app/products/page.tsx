"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import ProductCard from "@/app/components/ProductCard";
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";
import {
  X,
  SlidersHorizontal,
  Search,
  Check,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BackToHome from "../components/BackToHome";

/* ================================================================
   TYPES
================================================================ */
interface ApiProduct {
  id: string;
  name: string;
  description: string;
  weight: string;
  is_sold_out: boolean;
  category_name: string;
  image: string;
}

interface PaginatedResponse {
  products: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Category {
  id: string;
  name: string;
}

const ITEMS_PER_PAGE = 24;

/* ================================================================
   PAGINATION COMPONENT
================================================================ */
function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  /* Build page number array with ellipsis logic */
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [];
    if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, "…", totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "…", page - 1, page, page + 1, "…", totalPages);
    }
    return pages;
  };

  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  return (
    <div className="mt-14 flex flex-col items-center gap-5">
      {/* Result range */}
      <p className="text-xs text-gray-400 uppercase tracking-widest">
        Showing <span className="font-semibold text-gray-700">{start}–{end}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> pieces
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500
                     hover:border-[#C8A45D] hover:text-[#C8A45D] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500
                     hover:border-[#C8A45D] hover:text-[#C8A45D] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page numbers */}
        {getPages().map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-9 min-w-[36px] px-2 items-center justify-center rounded-lg text-sm font-medium transition-all
                ${p === page
                  ? "bg-[#1A0A05] text-white border border-[#1A0A05] shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#C8A45D] hover:text-[#C8A45D]"
                }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500
                     hover:border-[#C8A45D] hover:text-[#C8A45D] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={15} />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Last page"
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500
                     hover:border-[#C8A45D] hover:text-[#C8A45D] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronsRight size={15} />
        </button>
      </div>

      {/* Mobile: simple "Page X of Y" */}
      <p className="text-xs text-gray-400 sm:hidden">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}

/* ================================================================
   MAIN PRODUCT CONTENT
================================================================ */
function ProductContent() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  /* ---- Local UI state (filters) ---- */
  const [categories,         setCategories]         = useState<Category[]>([]);
  const [isFilterOpen,       setIsFilterOpen]       = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stockFilter,        setStockFilter]        = useState<"all" | "inStock" | "soldOut">("all");
  const [sortBy,             setSortBy]             = useState<"newest" | "nameAsc" | "nameDesc" | "weightAsc" | "weightDesc">("newest");
  const [searchQuery,        setSearchQuery]        = useState("");

  /* ---- Paginated server state ---- */
  const [data,    setData]    = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  /* Scroll to top of grid on page change */
  const gridRef = useRef<HTMLDivElement>(null);

  /* ---- Load categories once ---- */
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  /* ---- Sync URL category param → filter state ---- */
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([decodeURIComponent(cat)]);
  }, []); // only on mount

  /* ---- Fetch products whenever filters / page change ---- */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page",  String(currentPage));
      params.set("limit", String(ITEMS_PER_PAGE));

      if (selectedCategories.length === 1) params.set("category", selectedCategories[0]);
      if (searchQuery.trim())              params.set("search",   searchQuery.trim());
      if (stockFilter === "inStock")       params.set("inStock",  "true");

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json: PaginatedResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategories, searchQuery, stockFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* Client-side sort (since we paginate server-side for most things,
     sort that can't easily go to server stays client-side on current page) */
  const sortedProducts = [...(data?.products ?? [])].sort((a, b) => {
    switch (sortBy) {
      case "nameAsc":    return a.name.localeCompare(b.name);
      case "nameDesc":   return b.name.localeCompare(a.name);
      case "weightAsc":  return parseFloat(a.weight) - parseFloat(b.weight);
      case "weightDesc": return parseFloat(b.weight) - parseFloat(a.weight);
      default:           return 0;
    }
  });

  /* Client-side soldOut filter (only needed when stockFilter === "soldOut",
     since the API only handles inStock=true) */
  const displayProducts =
    stockFilter === "soldOut"
      ? sortedProducts.filter((p) => p.is_sold_out)
      : sortedProducts;

  /* ---- Page change → update URL ---- */
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    // Smooth scroll to grid
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  /* ---- Filter helpers ---- */
  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
    // Reset to page 1 when filter changes
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setStockFilter("all");
    setSortBy("newest");
    setSearchQuery("");
    router.push(pathname, { scroll: false });
  };

  const activeFiltersCount = selectedCategories.length + (stockFilter !== "all" ? 1 : 0);

  /* ---- Debounce search to avoid hammering the API ---- */
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden bg-[#1A0A05] py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #C8A45D 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8B1A1A 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#1A0A05_80%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#C8A45D] to-transparent opacity-60" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] text-[#C8A45D] mb-3 block">
              <Sparkles size={10} fill="currentColor" /> Sinduri Jewellers <Sparkles size={10} fill="currentColor" />
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-none tracking-tight mb-3">
              Our Collection
            </h1>
            <div className="h-px w-24 bg-linear-to-r from-transparent via-[#C8A45D] to-transparent mx-auto mb-6" />
            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto font-light tracking-wide">
              Curated elegance, handcrafted for every precious moment.
            </p>
            {data && (
              <p className="mt-4 text-[#C8A45D]/70 text-xs tracking-widest uppercase">
                {data.total} pieces in our atelier
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="mb-3">
          <BackToHome />
        </div>

        {/* ===== SEARCH & FILTER BAR ===== */}
        <div className="mb-8 flex items-center gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Search rings, necklaces, gold…"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-white border border-[#E8DDD0] rounded-full py-3.5 pl-6 pr-20 text-sm text-gray-900 outline-none shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-[#C8A45D] focus:ring-2 focus:ring-[#C8A45D]/15 font-light"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={15} />
              </button>
            )}
            <Search size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C8A45D]" />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#1A0A05] text-white text-sm font-medium hover:bg-[#2A1505] transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <SlidersHorizontal size={15} />
            <span>Refine</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C8A45D] text-[10px] text-white font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* ===== ACTIVE FILTER PILLS ===== */}
        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="group flex items-center gap-1.5 rounded-full border border-[#C8A45D] bg-[#C8A45D]/5 px-4 py-1.5 text-xs font-semibold text-[#8B6914] hover:bg-[#C8A45D] hover:text-white transition-all"
                  >
                    {cat} <X size={11} className="opacity-60 group-hover:opacity-100" />
                  </button>
                ))}
                {stockFilter !== "all" && (
                  <button
                    onClick={() => setStockFilter("all")}
                    className="group flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    {stockFilter === "inStock" ? "In Stock" : "Sold Out"} <X size={11} />
                  </button>
                )}
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 size={11} /> Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== CATEGORY QUICK TABS ===== */}
        {categories.length > 0 && (
          <div className="mb-10 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 min-w-max mx-auto justify-start md:justify-center">
              <button
                onClick={() => { setSelectedCategories([]); handlePageChange(1); }}
                className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  selectedCategories.length === 0
                    ? "bg-[#1A0A05] text-white border-[#1A0A05]"
                    : "border-gray-200 text-gray-600 bg-white hover:border-[#C8A45D] hover:text-[#8B6914]"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.name)}
                  className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                    selectedCategories.includes(cat.name)
                      ? "bg-[#C8A45D] text-white border-[#C8A45D]"
                      : "border-gray-200 text-gray-600 bg-white hover:border-[#C8A45D] hover:text-[#8B6914]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== PRODUCT GRID ===== */}
        <div ref={gridRef} className="scroll-mt-24">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 sm:gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#C8A45D]/10 flex items-center justify-center mb-6">
                <Search size={32} className="text-[#C8A45D]" />
              </div>
              <h3 className="font-serif text-2xl text-gray-900 mb-2">No pieces found</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                Try adjusting your filters or explore a different collection
              </p>
              <button
                onClick={clearFilters}
                className="rounded-full bg-[#1A0A05] px-8 py-3 text-sm font-medium text-white hover:bg-[#2A1505] transition-all"
              >
                View All Collection
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 sm:gap-6"
            >
              {displayProducts.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                >
                  <ProductCard
                    product={{
                      id:          item.id,
                      title:       item.name,
                      weight:      item.weight,
                      category:    item.category_name || "Jewelry",
                      description: item.description,
                      image:       item.image || "https://placehold.co/400x500",
                      inStock:     !item.is_sold_out,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ===== PAGINATION ===== */}
        {!loading && data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={data.limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* ===== FILTER DRAWER ===== */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsFilterOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#FDFBF7] shadow-2xl flex flex-col"
            >
              <div className="bg-[#1A0A05] px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl text-white">Refine Results</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {data?.total ?? 0} pieces found
                  </p>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-[#C8A45D] to-transparent" />

              <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-28">
                {/* Sort */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A45D] mb-4">Sort By</h3>
                  <div className="space-y-1">
                    {[
                      { val: "newest",     label: "Newest First" },
                      { val: "nameAsc",    label: "Name A → Z" },
                      { val: "weightAsc",  label: "Weight: Light to Heavy" },
                      { val: "weightDesc", label: "Weight: Heavy to Light" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setSortBy(opt.val as any)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                          sortBy === opt.val
                            ? "bg-[#C8A45D]/10 text-[#8B6914] border border-[#C8A45D]/30"
                            : "text-gray-600 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        {opt.label}
                        {sortBy === opt.val && <Check size={14} className="text-[#C8A45D]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Collections */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A45D]">Collections</h3>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const isSelected = selectedCategories.includes(category.name);
                      return (
                        <label
                          key={category.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                isSelected ? "bg-[#C8A45D] border-[#C8A45D]" : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className={`text-sm ${isSelected ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                              {category.name}
                            </span>
                          </div>
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

                <div className="h-px bg-gray-200" />

                {/* Availability */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A45D] mb-4">Availability</h3>
                  <div className="space-y-1">
                    {[
                      { val: "all",     label: "All Pieces" },
                      { val: "inStock", label: "In Stock Only" },
                    ].map((opt) => (
                      <label
                        key={opt.val}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            stockFilter === opt.val ? "border-[#C8A45D]" : "border-gray-300"
                          }`}
                        >
                          {stockFilter === opt.val && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#C8A45D]" />
                          )}
                        </div>
                        <span className={`text-sm ${stockFilter === opt.val ? "font-semibold text-gray-900" : "text-gray-600"}`}>
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

              <div className="absolute bottom-0 w-full p-5 bg-white border-t border-gray-100">
                <div className="flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-all"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-[#1A0A05] text-sm font-semibold text-white hover:bg-[#2A1505] transition-all shadow-lg"
                  >
                    Show {data?.total ?? 0} Results
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   PAGE EXPORT (with Suspense boundary for useSearchParams)
================================================================ */
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#C8A45D] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-gray-400 uppercase tracking-widest">Loading Collection…</p>
          </div>
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}
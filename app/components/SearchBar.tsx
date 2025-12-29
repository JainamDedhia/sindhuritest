"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: (query: string) => void;
  count: number;
  onFilterClick?: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch,
  count,
  onFilterClick,
  placeholder = "Search for rings, necklaces...",
  className = ""
}: SearchBarProps) {
  
  const handleClear = () => {
    onChange("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch && value.trim()) {
      onSearch(value);
    }
  };

  return (
    <div className={`mb-8 flex flex-col gap-4 ${className}`}>
      
      {/* Product Count Label */}
      <div className="px-1">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {count} {count === 1 ? 'Product' : 'Products'} Found
        </p>
      </div>

      <div className="flex w-full items-center gap-3 md:max-w-3xl md:mx-auto">
        
        {/* Search Box */}
        <div 
          className="
            relative flex flex-1 items-center
            h-12 md:h-14 w-full
            rounded-2xl
            border border-gray-200 bg-white
            px-4
            focus-within:border-[var(--color-gold-primary)] 
            focus-within:ring-1 focus-within:ring-[var(--color-gold-primary)]
            transition-all shadow-sm
          "
        >
          {/* Search Icon */}
          <Search className="mr-3 h-5 w-5 text-gray-400 shrink-0 " />
          
          {/* Search Input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />

          {/* Clear Button */}
          {value && (
            <button
              onClick={handleClear}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button 
          onClick={onFilterClick}
          className="
            flex h-12 md:h-14 items-center gap-2 
            rounded-2xl border border-gray-200 bg-white 
            px-5 text-sm font-semibold text-gray-700 
            hover:bg-gray-50 active:scale-95 transition-all shadow-sm
          "
          type="button"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">Filter</span>
        </button>

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";
import SearchBar from "@/app/components/SearchBar"; // Import the new component

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  weight: string;
  is_sold_out: boolean;
  category_name: string;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // ... existing fetch logic ...
    const fetchProducts = async () => {
        try {
          const res = await fetch('/api/products');
          if (!res.ok) throw new Error("Failed to Fetch");
          const data = await res.json();
          setProducts(data);
        } catch (error) {
          console.log("Error Loading products: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.category_name || "").toLowerCase().includes(query)
    );
  });

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
        
        {/* === SEARCH BAR COMPONENT === */}
        <SearchBar 
           value={searchQuery} 
           onChange={setSearchQuery} 
           count={filteredProducts.length} 
        />

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
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
    </div>
  );
}
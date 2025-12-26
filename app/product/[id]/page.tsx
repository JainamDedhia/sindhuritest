"use client";

import { useEffect, useState } from "react";

/**
 * PRODUCT TYPE
 * Defines the structure of product data from API
 */
type Product = {
  id: string;
  name: string;
  price: string;
  image_url: string;
  category_name?: string;
  description?: string;
};

/**
 * PRODUCTS PAGE
 * Displays all available jewellery products in a grid
 * Includes loading states and empty state handling
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * FETCH PRODUCTS
   * Loads product data from API on component mount
   */
  useEffect(() => {
    fetch("/api/products")
      .then(async (res) => {
        if (!res.ok) {
          console.error("Failed to fetch products:", res.status);
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Invalid products data:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container py-12">
      
      {/* PAGE HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Our Jewellery Collection
        </h1>
        <p className="text-muted mt-2 text-lg">
          Crafted with purity, tradition, and trust
        </p>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-80 rounded-xl"
            />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💍</div>
          <h3 className="text-xl font-medium text-[var(--foreground)]">
            No products available yet
          </h3>
          <p className="text-muted mt-2">
            Check back soon for our latest collection
          </p>
        </div>
      )}

      {/* PRODUCTS GRID */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * PRODUCT CARD COMPONENT
 * Individual product display card with hover effects
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden transition-all duration-300 hover:shadow-xl group">
      
      {/* PRODUCT IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-ivory)]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gold border overlay on hover */}
        <div className="absolute inset-0 border-2 border-[var(--color-gold-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* PRODUCT INFO */}
      <div className="p-4 text-center">
        {/* Category badge (if available) */}
        {product.category_name && (
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-[var(--color-ivory)] text-[var(--color-text-secondary)] mb-2">
            {product.category_name}
          </span>
        )}

        {/* Product name */}
        <h3 className="font-medium text-lg text-[var(--foreground)] mb-1">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-sm text-muted font-medium">
          ₹ {parseFloat(product.price).toLocaleString('en-IN')}
        </p>

        {/* CTA Button */}
        <button className="mt-4 w-full px-4 py-2 text-sm rounded-full border border-[var(--color-gold-primary)] text-[var(--color-gold-primary)] hover:bg-[var(--color-gold-primary)] hover:text-white transition-all duration-300">
          Enquire Now
        </button>
      </div>
    </div>
  );
}
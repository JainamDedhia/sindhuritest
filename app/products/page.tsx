"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold">
          Our Jewellery Collection
        </h1>
        <p className="text-muted mt-2">
          Crafted with purity, tradition, and trust
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-72 rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Products */}
      {!loading && products.length === 0 && (
        <div className="text-center text-muted">
          No products available yet.
        </div>
      )}

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

/* ---------------- COMPONENT ---------------- */

function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className="bg-white overflow-hidden transition hover:shadow-xl"
      style={{
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Gold border on hover */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition"
          style={{
            border: "2px solid var(--color-gold-primary)",
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 text-center">
        <h3 className="font-medium text-lg">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-muted">
          ₹ {product.price}
        </p>

        <button
          className="mt-4 px-4 py-2 text-sm rounded-full"
          style={{
            border: "1px solid var(--color-gold-primary)",
            color: "var(--color-gold-primary)",
          }}
        >
          Enquire Now
        </button>
      </div>
    </div>
  );
}

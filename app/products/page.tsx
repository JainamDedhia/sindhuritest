"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: string;
  image_url: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
  fetch("/api/products")
    .then(async (res) => {
      if (!res.ok) {
        console.error("Fetch failed:", res.status);
        return [];
      }
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setProducts([]);
    });
}, []);


  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {products.map((p) => (
        <div key={p.id} className="border rounded-xl p-4">
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-48 object-contain"
          />
          <h3 className="mt-2 font-medium">{p.name}</h3>
          <p className="text-sm">₹{p.price}</p>
        </div>
      ))}
    </div>
  );
}

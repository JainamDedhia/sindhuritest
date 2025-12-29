"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log("🎨 COMPONENT RENDERING NOW!");  // <-- ADD THIS LINE

  useEffect(() => {
    console.log("🚀 useEffect fired!");
    
    fetch("/api/products")
      .then((res) => {
        console.log("📡 Got response:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("📦 Got data:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log("🔄 Render - Loading:", loading, "Products:", products.length);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Loading products...</h1>
        <p>Check console for logs</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        <h1>Error: {error}</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Products ({products.length})</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginTop: "40px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
            <img 
              src={product.image_url} 
              alt={product.name}
              style={{ width: "100%", height: "300px", objectFit: "cover", background: "#f0f0f0" }}
              onLoad={() => console.log("✅ Image loaded:", product.name)}
              onError={() => console.error("❌ Image failed:", product.name)}
            />
            <div style={{ padding: "16px" }}>
              <h3>{product.name}</h3>
              <p>₹ {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
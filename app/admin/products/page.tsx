"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Loader2, Star } from "lucide-react";

// Define the shape of our product data
interface Product {
  id: string;
  name: string;
  product_code: string;
  weight: string;
  image: string;
  is_sold_out: boolean;
  is_featured: boolean; // <--- Added this field
}

export default function AdminProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Fetch Products on Load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Pointing to Admin API to get full details including is_featured
      const res = await fetch("/api/admin/products"); 
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Delete Logic
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting product");
    }
  };

  // 3. Handle Stock Toggle
  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_sold_out: !currentStatus } : p));

    try {
      const res = await fetch(`/api/admin/products/${id}/toggle-stock`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ is_sold_out: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch (error) {
      alert("Failed to Update Stock status");
      // Revert if failed
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_sold_out: currentStatus } : p));
    }
  };

  // 4. Handle Featured Toggle (NEW)
  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_featured: !currentStatus } : p));

    try {
      const res = await fetch(`/api/admin/products/${id}/toggle-featured`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ is_featured: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch (error) {
      alert("Failed to Update Featured status");
      // Revert if failed
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_featured: currentStatus } : p));
    }
  };

  // 5. Filter Logic
  const filteredProducts = products.filter((p) =>
    (p.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (p.product_code?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-white min-h-screen">
      
      {/* === HEADER === */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Product Inventory</h1>
          <p className="text-sm text-gray-500">
            Manage, edit, or remove items from your catalog.
          </p>
        </div>
        
        <Link
          href="/admin/products/add"
          className="flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition shadow-sm"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      {/* === SEARCH BAR === */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
        />
      </div>

      {/* === TABLE === */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
  <tr>
    <th className="px-6 py-4 font-medium">Product</th>
    <th className="px-6 py-4 font-medium">SKU</th>
    <th className="px-6 py-4 font-medium text-center">Featured</th>
    <th className="px-6 py-4 font-medium">Weight</th>
    <th className="px-6 py-4 font-medium">Status</th>
    <th className="px-6 py-4 text-right font-medium">Actions</th>
  </tr>
</thead>

          
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-gray-50/50 transition">
                  
                  {/* Image & Name */}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                        {product.image ? (
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">—</div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-3 font-mono text-gray-500">
                    {product.product_code}
                  </td>

                  {/* FEATURED TOGGLE (NEW) */}
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                      className={`p-2 rounded-full transition-all ${
                        product.is_featured 
                          ? "bg-yellow-50 text-yellow-500 hover:bg-yellow-100" 
                          : "text-gray-300 hover:text-gray-400 hover:bg-gray-100"
                      }`}
                      title={product.is_featured ? "Remove from Featured" : "Add to Featured"}
                    >
                      <Star size={18} fill={product.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>

                  {/* Weight */}
                  <td className="px-6 py-3 text-gray-600">
                    {product.weight} g
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-3">
                    <button onClick={() => handleToggleStock(product.id, product.is_sold_out)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all 
                        ${product.is_sold_out 
                          ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 hover:bg-red-100"
                          : "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 hover:bg-green-100"
                        }
                      `}
                      title="Click to toggle status"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${product.is_sold_out ? "bg-red-600" : "bg-green-600"}`} />
                      {product.is_sold_out ? "Sold Out" : "In Stock"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <button className="rounded p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600" title="Edit">
                          <Edit2 size={16} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Add Category
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (res.ok) {
        setNewCategory("");
        fetchCategories(); // Refresh list
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add category");
      }
    } catch (error) {
      alert("Error adding category");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Delete Category
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products linked to it might lose their category.")) return;
    
    try {
      await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 space-y-8">
      
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Organize your products into collections.</p>
      </div>

      {/* CREATE FORM - Mobile Responsive (Stacks on mobile, Row on desktop) */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Add New Category</h2>
        
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="e.g. Bridal Sets" 
              className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black text-sm"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={submitting || !newCategory.trim()}
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition active:scale-95 sm:w-auto w-full"
          >
            {submitting ? <Loader2 className="animate-spin h-4 w-4"/> : <Plus size={16} />}
            Add
          </button>
        </form>
      </div>

      {/* LIST GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition hover:border-gray-300"
          >
            <div className="min-w-0">
              {/* 'truncate' prevents long names from breaking layout */}
              <h3 className="font-medium text-gray-900 truncate pr-2" title={cat.name}>
                {cat.name}
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">
                {new Date(cat.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <button 
              onClick={() => handleDelete(cat.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-600 active:scale-90"
              title="Delete Category"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <Tag className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p>No categories yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Form State (NO PRICE)
  const [form, setForm] = useState({
    name: "",
    description: "",
    weight: "",
    product_code: "",
    category_id: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Requires GET /api/categories route
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setUploading(true);
      const imageUrls = await Promise.all(files.map(uploadImage));
      setUploading(false);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          weight: parseFloat(form.weight),
          images: imageUrls
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create");
      }

      alert("Product Created Successfully! 🎉");

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </Link>
        <h1 className="text-3xl font-serif text-gray-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BASIC INFO */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="font-medium text-gray-900 border-b pb-2">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <input 
                required
                type="text" 
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                placeholder="e.g. Diamond Halo Ring"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Code (SKU)</label>
              <input 
                required
                type="text" 
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none font-mono text-sm"
                placeholder="e.g. RING-001"
                value={form.product_code}
                onChange={e => setForm({...form, product_code: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea 
              rows={4}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
              placeholder="Detailed product description..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>
        </div>

        {/* DETAILS (Weight & Category) - NO PRICE */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="font-medium text-gray-900 border-b pb-2">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weight (grams)</label>
              <input 
                required
                type="number" 
                step="0.001"
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                placeholder="0.000"
                value={form.weight}
                onChange={e => setForm({...form, weight: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select 
                required
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none bg-white"
                value={form.category_id}
                onChange={e => setForm({...form, category_id: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="font-medium text-gray-900 border-b pb-2">Product Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={src} className="h-full w-full object-cover" alt="preview" />
                <button 
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-500 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition">
              <UploadCloud className="text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">Add Images</span>
              <input type="file" multiple hidden accept="image/*" onChange={handleFileSelect} />
            </label>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[var(--color-gold-primary)] text-white px-8 py-3 rounded-xl font-medium hover:bg-yellow-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : null}
            {uploading ? "Uploading Images..." : loading ? "Saving..." : "Create Product"}
          </button>
        </div>

      </form>
    </div>
  );
}
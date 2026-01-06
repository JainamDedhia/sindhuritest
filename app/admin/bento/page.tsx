"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Trash2, Link as LinkIcon, LayoutGrid } from "lucide-react";

export default function AdminBentoPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [form, setForm] = useState({
    title: "",
    subtitle: "Explore Collection",
    target_link: "/products",
    size: "small", // default
    image_url: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/bento");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setForm(prev => ({ ...prev, image_url: data.secure_url }));
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) return alert("Please upload an image");

    await fetch("/api/admin/bento", {
      method: "POST",
      body: JSON.stringify({ ...form, position: items.length }),
    });
    
    setForm({ title: "", subtitle: "Explore Collection", target_link: "/products", size: "small", image_url: "" });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tile?")) return;
    await fetch("/api/admin/bento", { 
      method: "DELETE", 
      body: JSON.stringify({ id }) 
    });
    fetchItems();
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Bento Grid Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Design your category showcase layout.</p>
      </div>

      {/* ADD FORM */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="font-medium text-gray-900 mb-4">Add New Tile</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Title (e.g. Bridal)" 
                className="p-3 rounded-lg border border-gray-300 w-full text-sm"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                required
              />
              <select 
                className="p-3 rounded-lg border border-gray-300 w-full text-sm bg-white"
                value={form.size} onChange={e => setForm({...form, size: e.target.value})}
              >
                <option value="small">Small (1x1)</option>
                <option value="wide">Wide (2x1)</option>
                <option value="tall">Tall (1x2)</option>
                <option value="large">Large (2x2)</option>
              </select>
            </div>
            <input 
              type="text" placeholder="Link (e.g. /products?category=Bridal)" 
              className="p-3 rounded-lg border border-gray-300 w-full text-sm"
              value={form.target_link} onChange={e => setForm({...form, target_link: e.target.value})}
              required
            />
          </div>

          {/* Right: Image Upload */}
          <div className="flex gap-4">
             <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition h-32">
                {form.image_url ? (
                  <img src={form.image_url} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <>
                    <UploadCloud className="text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">{uploading ? "Uploading..." : "Upload Image"}</span>
                  </>
                )}
                <input type="file" hidden onChange={handleImageUpload} />
             </label>
             <button type="submit" disabled={uploading} className="bg-black text-white px-6 rounded-lg font-medium text-sm hover:bg-gray-800">
               Add
             </button>
          </div>
        </form>
      </div>

      {/* PREVIEW LIST */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
        {items.map((item) => {
          // Map size text to CSS classes for preview
          let spanClass = "col-span-1 row-span-1";
          if (item.size === 'wide') spanClass = "md:col-span-2";
          if (item.size === 'tall') spanClass = "row-span-2";
          if (item.size === 'large') spanClass = "md:col-span-2 row-span-2";

          return (
            <div key={item.id} className={`relative group rounded-xl overflow-hidden border border-gray-200 ${spanClass}`}>
              <img src={item.image_url} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center">
                <p className="font-serif text-xl">{item.title}</p>
                <p className="text-xs opacity-80 uppercase tracking-widest">{item.size}</p>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 bg-white text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
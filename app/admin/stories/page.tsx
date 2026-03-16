"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Trash2 } from "lucide-react";

export default function AdminStoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    title: "",
    target_link: "/products?category=",
    rank: 1, 
    image_url: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/story-highlights");
      if (res.ok) setItems(await res.json());
    } catch (error) {
      console.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST", body: formData
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

    try {
      await fetch("/api/admin/story-highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      setForm({ title: "", target_link: "/products?category=", rank: form.rank + 1, image_url: "" });
      fetchItems();
    } catch (error) {
      alert("Failed to save story");
    }
  };

  const handleDelete = async (rank: number) => {
    if (!confirm("Delete this story?")) return;
    try {
      await fetch(`/api/admin/story-highlights?rank=${rank}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      alert("Failed to delete story");
    }
  };

  if (loading) return <div className="p-10 flex items-center justify-center">Loading...</div>;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl text-[#1A0A05]">Story Highlights Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the Instagram-style category bubbles on your homepage.</p>
      </div>

      <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8DDD0]">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Title (e.g. Rings)" required
                className="p-3 rounded-xl border border-gray-300 w-full text-sm outline-none focus:border-[#C8A45D]"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              />
              <select 
                className="p-3 rounded-xl border border-gray-300 w-full text-sm bg-white outline-none focus:border-[#C8A45D]"
                value={form.rank} onChange={e => setForm({...form, rank: Number(e.target.value)})}
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>Position {num}</option>
                ))}
              </select>
            </div>
            <input 
              type="text" placeholder="Link (e.g. /products?search=rings)" required
              className="p-3 rounded-xl border border-gray-300 w-full text-sm outline-none focus:border-[#C8A45D]"
              value={form.target_link} onChange={e => setForm({...form, target_link: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
             <label className="flex-1 cursor-pointer border-2 border-dashed border-[#C8A45D]/40 bg-white rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 transition h-32 relative overflow-hidden">
                {form.image_url ? (
                  <img src={form.image_url} className="absolute inset-0 h-full w-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <UploadCloud className="text-[#C8A45D] mb-2" />
                    <span className="text-xs text-gray-500">{uploading ? "Uploading..." : "Upload Story Image"}</span>
                  </>
                )}
                <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
             </label>
             <button type="submit" disabled={uploading || !form.image_url} className="bg-[#1A0A05] text-white px-6 rounded-xl font-medium text-sm hover:bg-[#C8A45D] transition-colors disabled:opacity-50">
                Save
             </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl text-[#1A0A05] mb-4">Current Stories</h2>
        <div className="flex flex-wrap gap-6">
          {items.map((item) => (
             <div key={item.id} className="relative group flex flex-col items-center gap-2">
               <div className="w-20 h-20 rounded-full border-2 border-[#C8A45D] p-1 overflow-hidden relative">
                 <img src={item.image_url} className="w-full h-full object-cover rounded-full" alt={item.title} />
                 
                 {/* Hover Delete Overlay */}
                 <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button onClick={() => handleDelete(item.rank)} className="text-white hover:text-red-400">
                     <Trash2 size={18} />
                   </button>
                 </div>
               </div>
               <span className="text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
                 #{item.rank} {item.title}
               </span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
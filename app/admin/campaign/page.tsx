"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Trash2 } from "lucide-react";

export default function AdminCampaignPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    title: "",
    target_link: "/products",
    rank: 1, 
    image_url: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      // ✅ FIXED: was "/api/admin/campaign-bento" (wrong kebab-case)
      const res = await fetch("/api/admin/CampaignBento");
      if (res.ok) setItems(await res.json());
    } catch (error) {
      console.error("Failed to load items");
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

    try {
      const res = await fetch("/api/admin/CampaignBento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rank: Number(form.rank),
          title: form.title,
          target_link: form.target_link,
          image_url: form.image_url
        }),
      });
      
      if (!res.ok) throw new Error("Save failed");

      setForm({ title: "", target_link: "/products", rank: 1, image_url: "" });
      fetchItems();
    } catch (error) {
      alert("Failed to save campaign asset");
    }
  };

  const handleDelete = async (rank: number) => {
    if (!confirm("Delete this campaign slot?")) return;
    try {
      await fetch(`/api/admin/CampaignBento?rank=${rank}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      alert("Failed to delete slot");
    }
  };

  if (loading) return <div className="p-10 flex items-center justify-center">Loading...</div>;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Campaign Lookbook Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Design your layered campaign section (Background + 3 Cards).</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="font-medium text-gray-900 mb-4">Upload Campaign Asset</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Title (Optional)" 
                className="p-3 rounded-lg border border-gray-300 w-full text-sm"
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})}
              />
              <select 
                className="p-3 rounded-lg border border-gray-300 w-full text-sm bg-white"
                value={form.rank} 
                onChange={e => setForm({...form, rank: Number(e.target.value)})}
              >
                <option value={0}>Main Background Image</option>
                <option value={1}>Main Hero Card (Left)</option>
                <option value={2}>Top Right Card</option>
                <option value={3}>Bottom Right Card</option>
              </select>
            </div>
            <input 
              type="text" 
              placeholder="Link (e.g. /products?category=Bridal)" 
              className="p-3 rounded-lg border border-gray-300 w-full text-sm"
              value={form.target_link} 
              onChange={e => setForm({...form, target_link: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
             <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition h-32 relative overflow-hidden">
                {form.image_url ? (
                  <img src={form.image_url} className="absolute inset-0 h-full w-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <UploadCloud className="text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">{uploading ? "Uploading..." : "Upload Image"}</span>
                  </>
                )}
                <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
             </label>
             <button type="submit" disabled={uploading || !form.image_url} className="bg-black text-white px-6 rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50 transition">
                Save
             </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-medium text-gray-900 mb-4">Current Slots</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {items.map((item) => {
            let spanClass = "col-span-1";
            let label = "";
            if (item.rank === 0) { spanClass = "md:col-span-4 h-[150px]"; label = "Background Image"; }
            if (item.rank === 1) { spanClass = "md:col-span-2"; label = "Main Hero Card"; }
            if (item.rank === 2) { spanClass = "md:col-span-1"; label = "Top Right Card"; }
            if (item.rank === 3) { spanClass = "md:col-span-1"; label = "Bottom Right Card"; }

            return (
              <div key={item.id} className={`relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm ${spanClass}`}>
                <img src={item.image_url} className="w-full h-full object-cover" alt={item.title || label} />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 text-center">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-sm border border-white/30">
                    {label}
                  </span>
                  <p className="font-serif text-xl">{item.title}</p>
                </div>
                <button 
                  onClick={() => handleDelete(item.rank)}
                  className="absolute top-3 right-3 bg-white text-red-600 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-50 hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
          {items.length === 0 && (
            <div className="md:col-span-4 py-16 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              No campaign assets uploaded yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
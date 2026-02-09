"use client";

import { useState, useEffect } from "react";
import { Upload, Save, Link as LinkIcon, Type, Loader2, Edit3, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Define the shape of our Bento Item
interface BentoItem {
  id?: string;
  rank: number;
  title: string;
  image_url: string;
  target_link: string;
}

export default function AdminBentoPage() {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // EDITING STATE
  const [editingRank, setEditingRank] = useState<number | null>(null);
  const [formData, setFormData] = useState<BentoItem>({
    rank: 0,
    title: "",
    image_url: "",
    target_link: "",
  });

  // 1. FETCH ITEMS
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/FeaturedBento");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. IMAGE UPLOAD (Integrated Route)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.set("file", file); // Must be 'file' to match API

    try {
      // Send File to the SAME route
      const res = await fetch("/api/admin/FeaturedBento", {
        method: "POST",
        body: data, // Browser automatically sets Content-Type to multipart/form-data
      });
      
      const result = await res.json();
      
      if (result.url) {
        setFormData((prev) => ({ ...prev, image_url: result.url }));
      } else {
        alert("Upload failed: No URL returned");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 3. SUBMIT DATA (Integrated Route)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRank) return;

    // Send Data to the SAME route (as JSON)
    const payload = { ...formData, rank: editingRank };

    try {
      const res = await fetch("/api/admin/FeaturedBento", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Important: Tells API this is JSON
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Slot Updated Successfully!");
      setEditingRank(null);
      fetchItems(); // Refresh grid
    } catch (error) {
      alert("Failed to save item");
    }
  };

  // 4. OPEN EDITOR
  const openEdit = (rank: number) => {
    const existing = items.find((i) => i.rank === rank);
    setEditingRank(rank);
    setFormData({
      rank: rank,
      title: existing?.title || "",
      image_url: existing?.image_url || "",
      target_link: existing?.target_link || "",
    });
  };

  // 5. HELPER TO GET ITEM BY RANK
  const getItem = (rank: number) => items.find((i) => i.rank === rank);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Bento Grid Manager</h1>
            <p className="text-gray-500 mt-2">Click a slot below to edit the content visible on your homepage.</p>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200">
             ● Live Preview
          </div>
        </header>

        {/* ========================================================= */}
        {/* VISUAL SLOT EDITOR */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
          
          {/* SLOT 1: HERO (BIG LEFT) */}
          <div 
            onClick={() => openEdit(1)}
            className="lg:col-span-2 relative h-[300px] lg:h-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 bg-white"
          >
             {getItem(1) ? (
                <>
                  <Image src={getItem(1)!.image_url} alt="Hero" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <span className="text-xs font-bold uppercase tracking-widest bg-blue-600 px-2 py-1 rounded">Rank 1</span>
                    <h3 className="text-3xl font-serif mt-2">{getItem(1)!.title}</h3>
                  </div>
                </>
             ) : (
                <EmptySlot rank={1} label="Hero Section" />
             )}
             <EditOverlay label="Edit Hero" />
          </div>

          {/* RIGHT COLUMN */}
          <div className="grid grid-rows-2 gap-6 h-full">
            
            {/* SLOT 2: TOP RIGHT */}
            <div 
              onClick={() => openEdit(2)}
              className="relative h-[200px] lg:h-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 bg-white"
            >
              {getItem(2) ? (
                 <>
                   <Image src={getItem(2)!.image_url} alt="Slot 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                   <div className="absolute bottom-4 left-4 text-white">
                     <span className="text-[10px] font-bold uppercase tracking-widest bg-green-600 px-2 py-1 rounded">Rank 2</span>
                     <h3 className="text-lg font-serif mt-1">{getItem(2)!.title}</h3>
                   </div>
                 </>
              ) : (
                 <EmptySlot rank={2} label="Top Right" />
              )}
              <EditOverlay label="Edit" />
            </div>

            {/* SLOT 3: BOTTOM RIGHT */}
            <div 
               onClick={() => openEdit(3)}
               className="relative h-[200px] lg:h-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 bg-white"
            >
               {getItem(3) ? (
                 <>
                   <Image src={getItem(3)!.image_url} alt="Slot 3" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                   <div className="absolute bottom-4 left-4 text-white">
                     <span className="text-[10px] font-bold uppercase tracking-widest bg-purple-600 px-2 py-1 rounded">Rank 3</span>
                     <h3 className="text-lg font-serif mt-1">{getItem(3)!.title}</h3>
                   </div>
                 </>
               ) : (
                 <EmptySlot rank={3} label="Bottom Right" />
               )}
               <EditOverlay label="Edit" />
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* EDIT MODAL */}
        {/* ========================================================= */}
        {editingRank && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Edit3 size={18} /> Editing Slot #{editingRank}
                </h3>
                <button onClick={() => setEditingRank(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                  <Trash2 size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                
                {/* Image Upload */}
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Image</label>
                   <div className="flex gap-4">
                      {formData.image_url ? (
                        <div className="w-24 h-24 relative rounded-lg overflow-hidden border">
                           <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                           <ImageIcon />
                        </div>
                      )}
                      
                      <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition h-24">
                         {uploading ? <Loader2 className="animate-spin text-blue-500" /> : <Upload className="text-gray-400 mb-1" />}
                         <span className="text-xs text-gray-500">Click to Upload</span>
                         <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                      </label>
                   </div>
                </div>

                {/* Title */}
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                   <div className="relative">
                     <Type size={16} className="absolute left-3 top-3 text-gray-400" />
                     <input 
                       required 
                       value={formData.title}
                       onChange={e => setFormData({...formData, title: e.target.value})}
                       className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                       placeholder="e.g. Bridal Collection"
                     />
                   </div>
                </div>

                {/* Link */}
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Target Link</label>
                   <div className="relative">
                     <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                     <input 
                       required 
                       value={formData.target_link}
                       onChange={e => setFormData({...formData, target_link: e.target.value})}
                       className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none text-blue-600"
                       placeholder="e.g. /products/bridal"
                     />
                   </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2">
                   <button type="button" onClick={() => setEditingRank(null)} className="flex-1 py-3 border rounded-lg font-bold hover:bg-gray-50">Cancel</button>
                   <button type="submit" className="flex-1 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 flex justify-center gap-2 items-center">
                     <Save size={18} /> Save
                   </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function EmptySlot({ rank, label }: { rank: number, label: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 text-gray-400">
      <div className="p-3 bg-white rounded-full shadow-sm mb-3">
        <Plus size={24} />
      </div>
      <span className="font-bold text-sm text-gray-500">{label}</span>
      <span className="text-[10px] uppercase tracking-widest mt-1">Empty Slot #{rank}</span>
    </div>
  );
}

function EditOverlay({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
       <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
         <Edit3 size={14} /> {label}
       </span>
    </div>
  );
}
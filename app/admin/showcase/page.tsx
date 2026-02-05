"use client";

import { useState, useEffect } from "react";
import { UploadCloud, X, Loader2, ArrowLeft, Trash2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

interface ShowcaseItem {
  id: string;
  image_url: string;
  title: string;
  link: string;
}

export default function AdminShowcasePage() {
  const [slides, setSlides] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 1. Fetch Slides
  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      const res = await fetch("/api/showcase");
      if (res.ok) setSlides(await res.json());
    } catch (error) {
      console.error("Failed to load slides");
    } finally {
      setLoading(false);
    }
  }

  // 2. Handle File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  // 3. Upload to Cloudinary
  const uploadToCloudinary = async (fileToUpload: File) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  // 4. Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image!");

    setUploading(true);
    try {
      // A. Upload Image
      const imageUrl = await uploadToCloudinary(file);

      // B. Save to Database
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          image_url: imageUrl,
          link: linkUrl
        }),
      });

      if (!res.ok) throw new Error("Failed to save to database");

      // Success
      setTitle("");
      setLinkUrl("");
      removeImage();
      fetchSlides();
      alert("Style Look Added Successfully! 🎉");

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  // 5. Delete Slide
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this look?")) return;
    await fetch(`/api/showcase/${id}`, { method: "DELETE" });
    setSlides(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <Link href="/admin/analytics" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-serif text-gray-900">Style Showcase</h1>
        <p className="text-gray-500 mt-1">Manage the "Choose Your Look" carousel images.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-10">
            <h2 className="font-medium text-gray-900 border-b pb-3 mb-4">Add New Look</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Look Image</label>
                {preview ? (
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-gray-200">
                    <img src={preview} className="h-full w-full object-cover" alt="preview" />
                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:text-red-500 transition">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer aspect-[3/4] w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-[var(--color-gold-primary)] transition group">
                    <UploadCloud className="text-gray-400 mb-2 group-hover:text-[var(--color-gold-primary)] transition-colors" />
                    <span className="text-xs text-gray-500 font-medium">Upload Portrait Image</span>
                    <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                  </label>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input 
                  type="text" required placeholder="e.g. Office Look"
                  className="w-full p-2.5 mt-1 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                  value={title} onChange={e => setTitle(e.target.value)}
                />
              </div>

              {/* Link Input */}
              <div>
                <label className="text-sm font-medium text-gray-700">Link URL</label>
                <div className="relative mt-1">
                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" placeholder="/products?category=office"
                    className="w-full p-2.5 pl-9 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                    value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-gold-primary)] text-white py-3 rounded-xl font-medium hover:brightness-90 transition disabled:opacity-50 mt-2"
              >
                {uploading ? <Loader2 className="animate-spin" /> : "Save Look"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: List of Slides */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900">Active Looks ({slides.length})</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading looks...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">No looks added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {slides.map(slide => (
                <div key={slide.id} className="group relative bg-white p-3 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden relative mb-3">
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  
                  <div className="px-1">
                    <p className="font-bold text-gray-900 truncate">{slide.title}</p>
                    <p className="text-xs text-gray-500 truncate">{slide.link || "No Link"}</p>
                  </div>

                  <button 
                    onClick={() => handleDelete(slide.id)}
                    className="absolute top-4 right-4 bg-white text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 shadow-lg transition hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
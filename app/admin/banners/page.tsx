"use client";

import { useState, useRef } from "react";
import { 
  ImagePlus, 
  X, 
  Loader2, 
  CheckCircle2, 
  ArrowUpRight,
  Monitor,
  Smartphone
} from "lucide-react";

export default function AdminBannerUploadPage() {
  /* ================= CONFIG ================= */
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  /* ================= STATE ================= */
  const [desktop, setDesktop] = useState<{ file: File | null; preview: string | null; loading: boolean }>({
    file: null, preview: null, loading: false
  });

  const [mobile, setMobile] = useState<{ file: File | null; preview: string | null; loading: boolean }>({
    file: null, preview: null, loading: false
  });

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  /* ================= HANDLERS ================= */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'desktop') {
        setDesktop({ ...desktop, file, preview: previewUrl });
      } else {
        setMobile({ ...mobile, file, preview: previewUrl });
      }
    }
  };

  const clearSelection = (type: 'desktop' | 'mobile') => {
    if (type === 'desktop') {
      setDesktop({ ...desktop, file: null, preview: null });
      if (desktopInputRef.current) desktopInputRef.current.value = "";
    } else {
      setMobile({ ...mobile, file: null, preview: null });
      if (mobileInputRef.current) mobileInputRef.current.value = "";
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");
    return data.secure_url;
  };

  const saveBanner = async (type: "desktop" | "mobile") => {
    const state = type === "desktop" ? desktop : mobile;
    const setState = type === "desktop" ? setDesktop : setMobile;

    if (!state.file) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const imageUrl = await uploadToCloudinary(state.file);
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl, device_type: type }),
      });

      if (!res.ok) throw new Error("Database save failed");

      alert(`${type === 'desktop' ? 'Desktop' : 'Mobile'} banner updated successfully.`);
      clearSelection(type);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        
        {/* === HEADER === */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium text-gray-900">Banner Upload</h1>
            <p className="mt-1 text-sm text-gray-500">Update your storefront visuals for all devices.</p>
          </div>
          <a href="/admin/banners/manage" className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:shadow-sm">
            Manage Existing
            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-900" />
          </a>
        </div>

        {/* === MAIN LAYOUT === */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* === DESKTOP UPLOAD (Takes 2/3 width) === */}
          <div className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Monitor size={16} />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Desktop Banner</h2>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">1920 x 800px</span>
              </div>

              {/* PREVIEW & UPLOAD ZONE */}
              <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100 transition-all hover:ring-gray-200">
                {desktop.preview ? (
                  // STATE: FILE SELECTED
                  <div className="group relative h-full w-full">
                    <img src={desktop.preview} className="h-full w-full object-cover" alt="Desktop Preview" />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <button 
                        onClick={() => clearSelection('desktop')}
                        className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm hover:bg-white hover:text-red-500 transition"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // STATE: EMPTY / UPLOAD
                  <div 
                    onClick={() => desktopInputRef.current?.click()}
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 transition hover:bg-gray-100"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                      <ImagePlus className="h-6 w-6 text-[var(--color-gold-primary)]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Click to upload desktop image</p>
                      <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP</p>
                    </div>
                  </div>
                )}
                <input ref={desktopInputRef} type="file" hidden accept="image/*" onChange={(e) => handleFileSelect(e, 'desktop')} />
              </div>

              {/* ACTION BAR */}
              <div className="mt-6 flex justify-end border-t border-gray-50 pt-4">
                <button
                  onClick={() => saveBanner('desktop')}
                  disabled={!desktop.file || desktop.loading}
                  className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {desktop.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {desktop.loading ? "Uploading..." : "Publish Desktop"}
                </button>
              </div>
            </div>
          </div>

          {/* === MOBILE UPLOAD (Takes 1/3 width) === */}
          <div className="lg:col-span-1">
            <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <Smartphone size={16} />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Mobile Banner</h2>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">9:16</span>
              </div>

              {/* PREVIEW & UPLOAD ZONE */}
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100 transition-all hover:ring-gray-200">
                {mobile.preview ? (
                  <div className="group relative h-full w-full">
                    <img src={mobile.preview} className="h-full w-full object-cover" alt="Mobile Preview" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <button 
                        onClick={() => clearSelection('mobile')}
                        className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm hover:bg-white hover:text-red-500 transition"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => mobileInputRef.current?.click()}
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 transition hover:bg-gray-100"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                      <ImagePlus className="h-6 w-6 text-[var(--color-gold-primary)]" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-medium text-gray-900">Upload mobile image</p>
                      <p className="text-xs text-gray-400 mt-1">Portrait Mode</p>
                    </div>
                  </div>
                )}
                <input ref={mobileInputRef} type="file" hidden accept="image/*" onChange={(e) => handleFileSelect(e, 'mobile')} />
              </div>

              {/* ACTION BAR */}
              <div className="mt-6 flex justify-center border-t border-gray-50 pt-4">
                <button
                  onClick={() => saveBanner('mobile')}
                  disabled={!mobile.file || mobile.loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {mobile.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {mobile.loading ? "Uploading..." : "Publish Mobile"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
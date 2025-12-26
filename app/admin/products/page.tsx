"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

export default function AdminProductUploadPage() {
  /* ================= STATE ================= */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= CLOUDINARY ================= */
  const CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Categories API error:", data);
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setCategories([]);
      });
  }, []);

  /* ================= UPLOAD HANDLER ================= */
  const handleUpload = async () => {
    if (!name || !price || !file) {
      alert("Name, price and image are required");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      alert("Invalid price");
      return;
    }

    setLoading(true);

    try {
      /* ---------- 1. Upload image to Cloudinary ---------- */
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      /* ---------- 2. Save product to Neon ---------- */
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          price: parsedPrice,
          category_id: categoryId || null,
          image_url: cloudData.secure_url,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("DB ERROR:", err);
        throw new Error("Database insert failed");
      }

      /* ---------- 3. Reset ---------- */
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setFile(null);
      setPreview(null);

      alert("Product uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
  <section className="min-h-screen bg-[var(--color-cream)] py-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Product Upload
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Add new jewellery products to your store
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT – FORM */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-8 space-y-8">

          {/* BASIC INFO */}
          <div>
            <h2 className="text-lg font-medium mb-4">
              Product Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm mb-1 block">
                  Product Name *
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="22K Gold Ring"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="45000"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm mb-1 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handcrafted premium gold jewellery"
                rows={3}
              />
            </div>

            <div className="mt-6">
              <label className="text-sm mb-1 block">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">
                  Select category (optional)
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <h2 className="text-lg font-medium mb-4">
              Product Image
            </h2>

            <div
              className="group cursor-pointer rounded-xl border-2 border-dashed
                         border-[var(--color-border)] bg-[var(--color-ivory)]
                         p-8 text-center transition
                         hover:border-[var(--color-gold-primary)]
                         hover:bg-white"
              onClick={() =>
                document.getElementById("imageInput")?.click()
              }
            >
              <input
                id="imageInput"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setPreview(URL.createObjectURL(f));
                  }
                }}
              />

              <div className="space-y-2">
                <p className="font-medium">
                  Drag & drop image here
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  or <span className="text-[var(--color-gold-primary)]">browse</span>
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  JPG, PNG, WEBP • Optimized via Cloudinary
                </p>
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="pt-4">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[var(--color-gold-primary)]
                         text-white font-medium tracking-wide
                         hover:opacity-90 transition"
            >
              {loading ? "Uploading…" : "Upload Product"}
            </button>
          </div>
        </div>

        {/* RIGHT – PREVIEW */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-medium mb-4">
            Live Preview
          </h2>

          <div className="aspect-4/5 rounded-xl border border-[var(--color-border)]
                          bg-[var(--color-ivory)]
                          flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-sm text-[var(--color-text-secondary)]">
                Image preview will appear here
              </span>
            )}
          </div>

          <div className="mt-4 text-xs text-[var(--color-text-secondary)] space-y-1">
            <p>✔ High-resolution support</p>
            <p>✔ Cloudinary CDN optimized</p>
            <p>✔ Secure image storage</p>
          </div>
        </div>

      </div>
    </div>
  </section>
);
}
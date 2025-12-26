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
    <section className="w-full flex justify-center">
      <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold">
            Product Upload
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Add jewellery products to your catalogue
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT FORM */}
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 space-y-6">

            <div>
              <label className="block text-sm mb-2">
                Product Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="22K Gold Ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handcrafted premium gold ring"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45000"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
              >
                <option value="">
                  Select category (optional)
                </option>

                {categories.length > 0 &&
                  categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* IMAGE UPLOAD */}
            <div
              className="cursor-pointer border-2 border-dashed
                         border-[var(--color-border)]
                         rounded-xl p-8 text-center
                         hover:border-[var(--color-gold-primary)]
                         transition"
              onClick={() =>
                document
                  .getElementById("imageInput")
                  ?.click()
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
              <p>
                Drag & drop or{" "}
                <span className="text-[var(--color-gold-primary)] font-medium">
                  browse
                </span>
              </p>
              <p className="text-xs mt-1 text-[var(--color-text-secondary)]">
                JPG, PNG, WEBP supported
              </p>
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary w-full h-12 text-base"
            >
              {loading ? "Uploading..." : "Upload Product"}
            </button>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8">
            <h2 className="text-lg font-medium mb-4">
              Image Preview
            </h2>

            <div
              className="aspect-[4/5] rounded-xl border
                         border-[var(--color-border)]
                         bg-[var(--color-ivory)]
                         flex items-center justify-center
                         overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-contain"
                  alt="Preview"
                />
              ) : (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  No image selected
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

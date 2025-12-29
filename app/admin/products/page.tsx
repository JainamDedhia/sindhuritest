"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

export default function AdminProductUploadPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  // Check if Cloudinary is configured
  useEffect(() => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      console.error("❌ Cloudinary not configured!");
      console.log("CLOUD_NAME:", CLOUD_NAME);
      console.log("UPLOAD_PRESET:", UPLOAD_PRESET);
    } else {
      console.log("✅ Cloudinary configured:", { CLOUD_NAME, UPLOAD_PRESET });
    }
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log("📁 File selected:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      console.log("✅ Preview URL created:", previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      alert("Valid price is required");
      return;
    }

    if (!file) {
      alert("Product image is required");
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      alert("❌ Cloudinary not configured! Check your .env.local file");
      return;
    }

    setLoading(true);
    setUploadSuccess(false);

    try {
      console.log("📤 Starting upload to Cloudinary...");
      console.log("☁️ Cloud name:", CLOUD_NAME);
      console.log("☁️ Upload preset:", UPLOAD_PRESET);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      console.log("☁️ Uploading to:", cloudinaryUrl);

      const cloudRes = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!cloudRes.ok) {
        const errorText = await cloudRes.text();
        console.error("❌ Cloudinary error response:", errorText);
        throw new Error(`Cloudinary upload failed: ${cloudRes.status}`);
      }

      const cloudData = await cloudRes.json();
      console.log("☁️ Cloudinary full response:", cloudData);

      if (!cloudData.secure_url) {
        console.error("❌ No secure_url in response:", cloudData);
        throw new Error("Cloudinary upload failed - no URL returned");
      }

      console.log("✅ Image uploaded successfully!");
      console.log("🔗 Image URL:", cloudData.secure_url);
      console.log("📏 Image size:", cloudData.width, "x", cloudData.height);

      console.log("💾 Saving to database...");
      const dbPayload = {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        category_id: categoryId || null,
        image_url: cloudData.secure_url,
      };
      console.log("📦 Database payload:", dbPayload);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Database error:", err);
        throw new Error(err.message || "Failed to save product");
      }

      const savedProduct = await res.json();
      console.log("✅ Product saved:", savedProduct);

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setFile(null);
      setPreview(null);
      setUploadSuccess(true);

      alert("✅ Product uploaded successfully!");
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      alert(`Upload failed: ${err.message}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[var(--color-cream)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Product Upload
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Add new jewellery products to your store
          </p>

          {/* Cloudinary Config Check */}
          {(!CLOUD_NAME || !UPLOAD_PRESET) && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                ⚠️ Cloudinary is not configured!
              </p>
              <p className="text-sm text-red-600 mt-1">
                Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
                NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file
              </p>
            </div>
          )}
        </div>

        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 font-medium">
              ✅ Product uploaded successfully!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-8 space-y-8">
            <div>
              <h2 className="text-lg font-medium mb-4">Product Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm mb-1 block font-medium">
                    Product Name *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="22K Gold Ring"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block font-medium">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="45000"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm mb-1 block font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Handcrafted premium gold jewellery"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="mt-6">
                <label className="text-sm mb-1 block font-medium">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select category (optional)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Product Image *</h2>

              <div
                className="group cursor-pointer rounded-xl border-2 border-dashed
                           border-[var(--color-border)] bg-[var(--color-ivory)]
                           p-8 text-center transition
                           hover:border-[var(--color-gold-primary)]
                           hover:bg-white"
                onClick={() =>
                  !loading && document.getElementById("imageInput")?.click()
                }
              >
                <input
                  id="imageInput"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />

                <div className="space-y-2">
                  <p className="font-medium">
                    {file ? `✅ ${file.name}` : "Drag & drop image here"}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    or{" "}
                    <span className="text-[var(--color-gold-primary)]">
                      browse
                    </span>
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    JPG, PNG, WEBP • Max 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleUpload}
                disabled={loading || !file || !name || !price}
                className="w-full h-12 rounded-xl bg-[var(--color-gold-primary)]
                           text-white font-medium tracking-wide
                           hover:opacity-90 transition
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Product"
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-medium mb-4">Live Preview</h2>

            <div className="aspect-square rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error("❌ Preview image failed:", preview);
                  }}
                />
              ) : (
                <div className="text-center p-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Select an image
                  </span>
                </div>
              )}
            </div>

            {(name || price) && (
              <div className="mt-4 p-4 bg-[var(--color-ivory)] rounded-lg">
                {name && <p className="font-medium text-sm">{name}</p>}
                {price && (
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    ₹ {parseFloat(price).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 text-xs text-[var(--color-text-secondary)] space-y-1">
              <p>✔ High-resolution support</p>
              <p>✔ Cloudinary CDN optimized</p>
              <p>✔ Automatic image compression</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
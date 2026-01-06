"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

export default function AdminProductUploadPage() {
  const [productCode, setProductCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState(""); // Changed from price
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const GOLD_RATE = 7000; // You can make this dynamic later

  // Calculate estimated price
  const estimatedPrice = weight ? (parseFloat(weight) * GOLD_RATE).toFixed(0) : "0";

  useEffect(() => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      console.error("❌ Cloudinary not configured!");
    }
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!productCode.trim()) {
      alert("Product code is required");
      return;
    }

    if (!name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      alert("Valid weight is required");
      return;
    }

    if (!file) {
      alert("Product image is required");
      return;
    }

    setLoading(true);
    setUploadSuccess(false);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const cloudRes = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!cloudRes.ok) {
        throw new Error(`Cloudinary upload failed: ${cloudRes.status}`);
      }

      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) {
        throw new Error("Cloudinary upload failed - no URL returned");
      }

      // Save to database
      const dbPayload = {
        product_code: productCode.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || null,
        weight: parseFloat(weight),
        category_id: categoryId || null,
        image_url: cloudData.secure_url,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save product");
      }

      // Reset form
      setProductCode("");
      setName("");
      setDescription("");
      setWeight("");
      setCategoryId("");
      setFile(null);
      setPreview(null);
      setUploadSuccess(true);

      alert("✅ Product uploaded successfully!");
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      alert(`Upload failed: ${err.message}`);
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
            Add new jewellery products with weight-based pricing
          </p>
        </div>

        {uploadSuccess && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-medium text-green-800">
              ✅ Product uploaded successfully!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-sm lg:col-span-2">
            
            {/* Product Code & Name */}
            <div>
              <h2 className="mb-4 text-lg font-medium">Product Information</h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Product Code * 
                    <span className="ml-1 text-xs text-gray-500">(e.g., RING-001)</span>
                  </label>
                  <input
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value.toUpperCase())}
                    placeholder="RING-001"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Product Name *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="22K Gold Ring"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Weight & Category */}
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Weight (grams) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="25.500"
                    disabled={loading}
                  />
                  {weight && (
                    <p className="mt-1 text-xs text-gray-500">
                      Estimated: ₹{parseInt(estimatedPrice).toLocaleString()} 
                      <span className="ml-1">(@ ₹{GOLD_RATE}/g)</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Handcrafted premium gold jewellery..."
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h2 className="mb-4 text-lg font-medium">Product Image *</h2>

              <div
                className="group cursor-pointer rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-ivory)] p-8 text-center transition hover:border-[var(--color-gold-primary)] hover:bg-white"
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
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleUpload}
                disabled={loading || !file || !name || !weight || !productCode}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-gold-primary)] font-medium tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  "Upload Product"
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">Live Preview</h2>

            <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  No image selected
                </span>
              )}
            </div>

            {(productCode || name || weight) && (
              <div className="space-y-2 rounded-lg bg-[var(--color-ivory)] p-4">
                {productCode && (
                  <p className="font-mono text-xs text-gray-500">{productCode}</p>
                )}
                {name && <p className="text-sm font-medium">{name}</p>}
                {weight && (
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    <p>Weight: {weight}g</p>
                    <p className="mt-1 font-semibold text-gray-700">
                      ≈ ₹{parseInt(estimatedPrice).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
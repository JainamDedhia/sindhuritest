"use client";

import { useState } from "react";

export default function ProductUploadPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadProduct = async () => {
    if (!file || !CLOUD_NAME || !UPLOAD_PRESET) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const cloudData = await cloudRes.json();

      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          image: cloudData.secure_url,
        }),
      });

      setName("");
      setPrice("");
      setFile(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center">
      <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Product Upload
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Add new jewellery products to your collection
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT — FORM */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 sm:p-8">
            <h2 className="text-lg font-medium mb-6">
              Product Details
            </h2>

            <div className="space-y-6">

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="22K Gold Ring"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (₹)
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="45000"
                />
              </div>

              {/* UPLOAD */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Product Image
                </label>

                <div
                  onClick={() =>
                    document.getElementById("imageInput")?.click()
                  }
                  className="cursor-pointer rounded-xl border-2 border-dashed border-[var(--color-border)]
                             bg-[var(--color-cream)] px-6 py-10 text-center
                             hover:border-[var(--color-gold-primary)] transition"
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

                  <p className="text-sm">
                    Drag & drop or{" "}
                    <span className="text-[var(--color-gold-primary)] font-medium">
                      browse
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    JPG, PNG, WEBP supported
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={uploadProduct}
                disabled={loading}
                className="btn-primary w-full h-12 text-base"
              >
                {loading ? "Uploading..." : "Upload Product"}
              </button>
            </div>
          </div>

          {/* RIGHT — PREVIEW */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 sm:p-8">
            <h2 className="text-lg font-medium mb-6">
              Live Preview
            </h2>

            <div className="w-full aspect-[4/5] rounded-xl border border-[var(--color-border)]
                            bg-[var(--color-ivory)] flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  No image selected
                </span>
              )}
            </div>

            <ul className="mt-6 space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>✔ Optimized via Cloudinary CDN</li>
              <li>✔ Premium jewellery display</li>
              <li>✔ High-resolution support</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

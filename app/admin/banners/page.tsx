"use client";

import { useState } from "react";

export default function AdminBannerUploadPage() {
  /* ================= CLOUDINARY ================= */
  const CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  /* ================= DESKTOP BANNER STATE ================= */
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [desktopLoading, setDesktopLoading] = useState(false);

  /* ================= MOBILE BANNER STATE ================= */
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [mobileLoading, setMobileLoading] = useState(false);

  /* ================= UPLOAD HANDLER ================= */
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    return data.secure_url;
  };

  const saveBanner = async(
    file: File,
    deviceType: "desktop" | "mobile",
    reset: () => void,
    setLoading: (v: boolean) => void
  ) => {
    setLoading(true);
    
    /* ================= UPLOAD FOR BOTH MOBILE AND DESKTOP ================= */
    try{
      const imageUrl = await uploadToCloudinary(file);
      
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          image_url: imageUrl,
          device_type: deviceType
        }),
      });

      if(!res.ok) throw new Error("DB save Failed");

      alert(`${deviceType} banner uploaded successfully`);
      reset();
  }
    catch(err){
      console.error(err);
      alert("Banner upload failed");
    }
    finally{
      setLoading(false);
    }
};
  
  /* ================= UI ================= */
  return (
    <section className="min-h-screen bg-[var(--color-cream)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold">
            Banner Upload
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Upload separate banners for desktop and mobile devices
          </p>
        </div>

        {/* ================= DESKTOP BANNER ================= */}
        <div className="mb-14 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-8">
          <h2 className="text-xl font-medium mb-2">
            Desktop Banner
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Used for laptop and tablet devices (16:9)
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* UPLOAD */}
            <div>
              <div
                className="cursor-pointer rounded-xl border-2 border-dashed
                           border-[var(--color-border)] bg-[var(--color-ivory)]
                           p-10 text-center transition
                           hover:border-[var(--color-gold-primary)]
                           hover:bg-white"
                onClick={() =>
                  document.getElementById("desktopBanner")?.click()
                }
              >
                <input
                  id="desktopBanner"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setDesktopFile(f);
                      setDesktopPreview(URL.createObjectURL(f));
                    }
                  }}
                />

                <p className="font-medium">
                  Upload Desktop Banner
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Recommended: 1920 × 800
                </p>
              </div>

              <button
                onClick={() =>
                  desktopFile &&
                  saveBanner(
                    desktopFile,
                    "desktop",
                    () => {
                      setDesktopFile(null);
                      setDesktopPreview(null);
                    },
                    setDesktopLoading
                  )
                }
                disabled={desktopLoading}
                className="mt-4 w-full h-11 rounded-xl
                           bg-[var(--color-gold-primary)]
                           text-white font-medium"
              >
                {desktopLoading ? "Uploading…" : "Upload Desktop Banner"}
              </button>
            </div>

            {/* PREVIEW */}
            <div>
              <p className="text-sm mb-2">Live Preview</p>
              <div className="aspect-[16/9] rounded-xl border bg-[var(--color-ivory)]
                              flex items-center justify-center overflow-hidden">
                {desktopPreview ? (
                  <img
                    src={desktopPreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Desktop preview
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE BANNER ================= */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-8">
          <h2 className="text-xl font-medium mb-2">
            Mobile Banner
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Used for mobile devices (9:16)
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* UPLOAD */}
            <div>
              <div
                className="cursor-pointer rounded-xl border-2 border-dashed
                           border-[var(--color-border)] bg-[var(--color-ivory)]
                           p-10 text-center transition
                           hover:border-[var(--color-gold-primary)]
                           hover:bg-white"
                onClick={() =>
                  document.getElementById("mobileBanner")?.click()
                }
              >
                <input
                  id="mobileBanner"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setMobileFile(f);
                      setMobilePreview(URL.createObjectURL(f));
                    }
                  }}
                />

                <p className="font-medium">
                  Upload Mobile Banner
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Recommended: 1080 × 1920
                </p>
              </div>

              <button
                onClick={() =>
                  mobileFile &&
                  saveBanner(
                    mobileFile,
                    "mobile",
                    () => {
                      setMobileFile(null);
                      setMobilePreview(null);
                    },
                    setMobileLoading
                  )
                }
                disabled={mobileLoading}
                className="mt-4 w-full h-11 rounded-xl
                           bg-[var(--color-gold-primary)]
                           text-white font-medium"
              >
                {mobileLoading ? "Uploading…" : "Upload Mobile Banner"}
              </button>
            </div>

            {/* PREVIEW */}
            <div>
              <p className="text-sm mb-2">Live Preview</p>
              <div className="aspect-[9/16] rounded-xl border bg-[var(--color-ivory)]
                              flex items-center justify-center overflow-hidden">
                {mobilePreview ? (
                  <img
                    src={mobilePreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Mobile preview
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

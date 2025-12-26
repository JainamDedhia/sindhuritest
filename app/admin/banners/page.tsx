"use client";

import { useState } from "react";

export default function BannerUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Banner Upload</h2>

      <div className="bg-white p-6 rounded-xl border max-w-lg space-y-4">
        <input
          type="file"
          onChange={(e) =>
            e.target.files &&
            setPreview(URL.createObjectURL(e.target.files[0]))
          }
        />

        {preview && (
          <img
            src={preview}
            alt="Banner Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        )}

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Upload Banner
        </button>
      </div>
    </div>
  );
}

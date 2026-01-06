"use client";

import { useEffect, useState } from "react";
import { Coins, Save, Loader2, RefreshCw } from "lucide-react";

export default function GoldRatePage() {
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // 1. Fetch Current Rate
  useEffect(() => {
    fetchRate();
  }, []);

  const fetchRate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setRate(data.rate);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to load rate");
    } finally {
      setLoading(false);
    }
  };

  // 2. Save New Rate
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate }),
      });

      if (!res.ok) throw new Error("Failed to save");

      alert("Gold Rate Updated Successfully! 🌟");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      alert("Error updating rate");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-white min-h-screen">
      
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Daily Gold Rate</h1>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-xl rounded-xl border border-amber-200 bg-amber-50/50 p-8 shadow-sm">
        
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Coins size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Current Rate (per gram)</h2>
            <p className="text-xs text-gray-500">
              Last checked: {lastUpdated || "Just now"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="relative">
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-4 pl-10 pr-4 text-2xl font-bold text-gray-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="0"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={18} />}
              {saving ? "Updating..." : "Update Rate"}
            </button>
            
            <button
              type="button"
              onClick={fetchRate}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-gray-700 hover:bg-gray-50"
              title="Reload current rate"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
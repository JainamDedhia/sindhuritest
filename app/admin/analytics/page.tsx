"use client";

import { useEffect, useState } from "react";
import { Package, Layers, Scale, AlertCircle, RefreshCcw, Loader2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({ 
    total_products: 0, 
    total_categories: 0, 
    total_weight: "0", 
    sold_out: 0 
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch fresh data
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Configuration for the cards
  const cards = [
    {
      label: "Total Products",
      value: stats.total_products,
      desc: "Active items in catalog",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Categories",
      value: stats.total_categories,
      desc: "Product classifications",
      icon: Layers,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Out of Stock",
      value: stats.sold_out,
      desc: "Items marked as sold",
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 bg-white min-h-screen">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Dashboard Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time overview of your inventory.</p>
        </div>
        <button 
          onClick={fetchStats} 
          className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
          title="Refresh Data"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* STATS GRID */}
      {loading && stats.total_products === 0 ? (
         <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.color}`}>
                  <card.icon size={24} />
                </div>
                {/* Optional: Add percentage growth here later */}
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-sm font-medium text-gray-900 mt-1">{card.label}</p>
                <p className="text-xs text-gray-500 mt-1">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
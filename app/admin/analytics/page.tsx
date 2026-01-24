"use client";

import { useEffect, useState } from "react";
import { 
  Package, Layers, AlertCircle, RefreshCcw, Loader2, Users, TrendingUp 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ 
    total_products: 0, 
    total_categories: 0, 
    sold_out: 0,
    total_users: 0,
    category_data: [] 
  });
  const [loading, setLoading] = useState(true);

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

  // --- CHART COLORS (Premium Gold Palette) ---
  const GOLD_PRIMARY = "#D4AF37"; // Your brand gold
  const GOLD_LIGHT = "#F3E5AB";
  const DARK_ACCENT = "#171717";  // Neutral-900
  const RED_ACCENT = "#991b1b";   // Deep Red for alerts
  
  // Stock Pie Data
  const stockData = [
    { name: 'In Stock', value: stats.total_products - stats.sold_out },
    { name: 'Sold Out', value: stats.sold_out },
  ];
  const PIE_COLORS = [GOLD_PRIMARY, DARK_ACCENT]; 

  // Stats Cards Configuration
  const cards = [
    {
      label: "Total Inventory",
      value: stats.total_products,
      desc: "Active products listed",
      icon: Package,
    },
    {
      label: "Categories",
      value: stats.total_categories,
      desc: "Product collections",
      icon: Layers,
    },
    {
      label: "Total Customers",
      value: stats.total_users,
      desc: "Registered accounts",
      icon: Users,
    },
    {
      label: "Stock Alert",
      value: stats.sold_out,
      desc: "Items currently sold out",
      icon: AlertCircle,
      isAlert: true, // Special styling for alert card
    },
  ];

  return (
    <div className="p-8 md:p-12 min-h-screen bg-gray-50/50 space-y-10">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-gray-900">Executive Overview</h1>
          <p className="text-gray-500 mt-2 font-light">
            Here's what's happening with your store today.
          </p>
        </div>
        <button 
          onClick={fetchStats} 
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-[var(--color-gold-primary)] hover:text-[var(--color-gold-primary)] transition-all shadow-sm"
        >
          <RefreshCcw size={16} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? "animate-spin" : ""}`} />
          <span className="text-sm font-medium">Refresh Data</span>
        </button>
      </div>

      {loading ? (
         <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--color-gold-primary)]" />
         </div>
      ) : (
        <>
          {/* 2. PREMIUM STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg ${
                  card.isAlert ? "border-red-100 bg-red-50/30" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    card.isAlert 
                      ? "bg-red-100 text-red-700" 
                      : "bg-[var(--color-gold-primary)]/10 text-[var(--color-gold-primary)]"
                  }`}>
                    <card.icon size={24} />
                  </div>
                  {/* Decorative background element */}
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gray-50 opacity-50 blur-2xl" />
                </div>
                
                <div>
                  <h3 className="font-serif text-4xl text-gray-900">{card.value}</h3>
                  <p className="text-sm font-medium text-gray-600 mt-1 uppercase tracking-wide text-[11px]">
                    {card.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 3. CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* BAR CHART (Takes up 2/3 width) */}
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-serif text-xl text-gray-900">Category Performance</h3>
                  <p className="text-sm text-gray-500 mt-1">Product distribution across collections</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <TrendingUp size={20} className="text-gray-400" />
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.category_data || []} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        fontFamily: 'serif'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[6, 6, 0, 0]}
                      fill="url(#goldGradient)" // Uses the gradient defined below
                    />
                    {/* Define Gradient */}
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GOLD_PRIMARY} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={GOLD_PRIMARY} stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DONUT CHART (Takes up 1/3 width) */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]">
              <h3 className="font-serif text-xl text-gray-900 mb-2">Inventory Health</h3>
              <p className="text-sm text-gray-500 mb-8">Stock vs Sold Out ratio</p>
              
              <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80} // Thinner, elegant donut
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {stockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Text in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-serif text-gray-900">{stats.total_products}</span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Total Items</span>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="flex justify-center gap-6 mt-4">
                {stockData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
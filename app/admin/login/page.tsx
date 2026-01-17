"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2,ArrowRight,ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store admin session in localStorage
        localStorage.setItem("admin_session", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      
      {/* MAIN CARD */}
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-100">
        
        {/* HEADER SECTION */}
        <div className="border-b border-gray-100 bg-white px-10 py-8 text-center">
          <h1 className="font-serif text-3xl text-gray-900">
            Sinduri Jewellers
          </h1>
          <div className="mx-auto mt-3 h-0.5 w-12 bg-[var(--color-gold-primary)]" />
          <p className="mt-3 text-xs font-medium uppercase tracking-widest text-gray-500">
            Admin Portal
          </p>
        </div>

        {/* FORM SECTION */}
        <div className="p-10">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full rounded-lg border border-gray-300 bg-white px-4 py-3 
                  text-sm text-gray-900 placeholder-gray-300 transition-all
                  focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-primary)]
                "
                placeholder="admin@sinduri.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full rounded-lg border border-gray-300 bg-white px-4 py-3 
                  text-sm text-gray-900 placeholder-gray-300 transition-all
                  focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-primary)]
                "
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button - GOLD THEME */}
            <button
              type="submit"
              disabled={loading}
              className="
                group mt-2 flex w-full items-center justify-center gap-2 rounded-lg 
                bg-[var(--color-gold-primary)] py-3.5 text-sm font-bold text-white shadow-sm 
                transition-all hover:bg-[var(--color-gold-accent)] active:scale-[0.99]
                disabled:opacity-70 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Secure Login
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-10 py-4 text-center border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            <ShieldCheck size={12} />
            Encrypted Connection
          </div>
        </div>

      </div>
    </div>
  );
}
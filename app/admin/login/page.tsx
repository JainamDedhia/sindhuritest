"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold-primary)]/10">
            <Lock className="h-8 w-8 text-[var(--color-gold-primary)]" />
          </div>
          <h1 className="font-serif text-2xl font-medium text-gray-900">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sinduri Jewellers Management
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-primary)]"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-primary)]"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-gold-primary)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-gold-accent)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
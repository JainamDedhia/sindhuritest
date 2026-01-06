"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Phone, CheckCircle2, Loader2, Shield } from "lucide-react";

export default function CompleteProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    phone: "",
    termsAccepted: false,
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    // If user already completed profile, redirect to home
    if (status === "authenticated" && session?.user?.hasCompletedProfile) {
      router.push("/");
    }
  }, [status, session, router]);

  const validatePhone = (phone: string) => {
    // Basic Indian phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!validatePhone(formData.phone)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          termsAccepted: formData.termsAccepted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update session
      await update();

      // Success - redirect to home
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-gold-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
          
          {/* Header */}
          <div className="border-b border-gray-100 bg-white px-8 py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-gold-primary)]/10">
              <CheckCircle2 className="h-7 w-7 text-[var(--color-gold-primary)]" />
            </div>
            <h1 className="font-serif text-2xl font-medium text-gray-900">
              Complete Your Profile
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Just one more step to get started
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            
            {/* Welcome Message */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-gray-900">{session?.user?.name}</span>! 
                We need a few details to personalize your experience.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Phone Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700">
                  <Phone size={16} />
                  WhatsApp Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      // Only allow digits
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, phone: value });
                    }}
                    className="
                      w-full rounded-lg border border-gray-300 bg-white py-3 pl-14 pr-4
                      text-sm text-gray-900 placeholder-gray-400
                      transition-all
                      focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20
                    "
                    placeholder="9876543210"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  This will be used for order updates and support
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:bg-gray-100">
                  <input
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={(e) =>
                      setFormData({ ...formData, termsAccepted: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[var(--color-gold-primary)] focus:ring-2 focus:ring-[var(--color-gold-primary)]/20"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="font-medium text-[var(--color-gold-primary)] hover:underline"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="font-medium text-[var(--color-gold-primary)] hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  flex w-full items-center justify-center gap-2 rounded-lg
                  bg-[var(--color-gold-primary)] py-3.5 text-sm font-bold text-white
                  shadow-sm transition-all
                  hover:bg-[var(--color-gold-accent)]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed disabled:opacity-70
                "
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-8 py-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <Shield size={12} />
              Your data is secure with us
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
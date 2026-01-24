"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Phone, MapPin, Loader2, CheckCircle } from "lucide-react";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    // Check if user has already completed onboarding
    if (status === "authenticated") {
      const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
      if (hasCompletedOnboarding === "true") {
        router.push("/");
      }
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save user details to localStorage (in production, save to database)
      const userProfile = {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        dateOfBirth: ""
      };

      localStorage.setItem("user_profile", JSON.stringify(userProfile));
      localStorage.setItem("onboarding_completed", "true");

      // Show success state
      setStep(3);
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--color-gold-primary)]" />
      </div>
    );
  }

  // Success Screen
  if (step === 3) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Aboard!</h1>
          <p className="text-gray-600">Redirecting you to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-gray-900">
            Welcome to Sinduri Jewellers
          </h1>
          <p className="mt-3 text-gray-600">
            We just need a few more details to personalize your experience
          </p>
          
          {/* Progress Indicator */}
          <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-[var(--color-gold-primary)]' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-[var(--color-gold-primary)]' : 'bg-gray-200'}`} />
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl md:p-12">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: Phone Number */}
            <div className={step === 1 ? "block" : "hidden"}>
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold-primary)]/10">
                  <Phone className="h-8 w-8 text-[var(--color-gold-primary)]" />
                </div>
                <h2 className="text-center text-2xl font-bold text-gray-900">
                  What's your phone number?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                  We'll use this to contact you about your orders
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-lg focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20"
                  placeholder="+91 XXXXX XXXXX"
                  pattern="[0-9+\s-]+"
                />
              </div>

              <button
                type="button"
                onClick={() => formData.phone.length >= 10 ? setStep(2) : alert("Please enter a valid phone number")}
                className="mt-8 w-full rounded-xl bg-[var(--color-gold-primary)] py-4 text-lg font-semibold text-white hover:bg-[var(--color-gold-accent)] transition-all"
              >
                Continue
              </button>
            </div>

            {/* STEP 2: Address */}
            <div className={step === 2 ? "block" : "hidden"}>
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold-primary)]/10">
                  <MapPin className="h-8 w-8 text-[var(--color-gold-primary)]" />
                </div>
                <h2 className="text-center text-2xl font-bold text-gray-900">
                  Where should we deliver?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                  Your shipping address
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Street Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 focus:border-[var(--color-gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]/20"
                    placeholder="House no, Street, Area"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 focus:border-[var(--color-gold-primary)] focus:outline-none"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 focus:border-[var(--color-gold-primary)] focus:outline-none"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 focus:border-[var(--color-gold-primary)] focus:outline-none"
                      placeholder="400001"
                      pattern="[0-9]{6}"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[var(--color-gold-primary)] py-4 font-semibold text-white hover:bg-[var(--color-gold-accent)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
"use client"

import { signIn, useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Loader2, ArrowRight } from "lucide-react"

function LoginForm() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("✅ User authenticated, checking onboarding status...");
      
      setTimeout(() => {
        const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
        console.log("📝 Onboarding status:", hasCompletedOnboarding);
        
        if (hasCompletedOnboarding !== "true") {
          console.log("🔄 Redirecting to onboarding...");
          window.location.href = "/onboarding";
        } else {
          console.log("🏠 Redirecting to:", callbackUrl);
          window.location.href = callbackUrl;
        }
      }, 100);
    }
  }, [status, session, callbackUrl]);

  const handleSignIn = async () => {
    setIsSigningIn(true)
    console.log("🔐 Starting Google sign-in...");
    try {
      // ✅ FIX: Don't specify callbackUrl - let NextAuth handle it automatically
      await signIn("google")
    } catch (error) {
      console.error("❌ Sign in error:", error)
      setIsSigningIn(false)
    }
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-gold-primary)] mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            {status === "loading" ? "Loading..." : "Redirecting..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-12">
        
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl font-medium text-gray-900">
            Sinduri Jewellers
          </h2>
          <div className="mx-auto mt-3 h-1 w-10 bg-[var(--color-gold-primary)]" />
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Please sign in to access your account.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="
              group relative flex w-full items-center justify-between
              rounded-xl border border-gray-200 bg-white p-4
              transition-all duration-200
              hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm
              active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {isSigningIn ? (
              <div className="flex w-full justify-center">
                 <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Continue with Google</p>
                    <p className="text-xs text-gray-500">Secure instant access</p>
                  </div>
                </div>
                <ArrowRight className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500" size={20} />
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
           <p className="text-xs text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
           </p>
        </div>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-gold-primary)] mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
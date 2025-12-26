"use client"

import { signIn, useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session) {
      // Successfully logged in, redirect
      router.replace(callbackUrl)
    }
  }, [status, session, callbackUrl, router])

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsSigningIn(false)
    }
  }

  // Don't auto-sign in, show a button instead
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Admin Login
        </h1>
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          Sign in with Google to access the admin panel
        </p>

        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full bg-black text-white py-3 rounded-lg font-medium
                     hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isSigningIn ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  )
}
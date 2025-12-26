<<<<<<< Updated upstream
"use client"

import { signIn, useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", { callbackUrl })
    }

    if (status === "authenticated") {
      router.replace(callbackUrl)
    }
  }, [status, callbackUrl, router])

  // 👇 Render nothing
  return null
=======
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        
        {/* Title */}
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>

        {/* Email input */}
        <div className="h-10 bg-gray-200 rounded mb-4"></div>

        {/* Password input */}
        <div className="h-10 bg-gray-200 rounded mb-6"></div>

        {/* Login button */}
        <div className="h-10 bg-gray-400 rounded"></div>

      </div>
    </div>
  );
>>>>>>> Stashed changes
}

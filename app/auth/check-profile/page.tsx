"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function CheckProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }

    if (status === "authenticated" && session) {
      // Check if user has completed profile
      if (session.user?.hasCompletedProfile === false) {
        router.push("/auth/complete-profile")
      } else {
        router.push(callbackUrl)
      }
    }
  }, [status, session, router, callbackUrl])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--color-gold-primary)]" />
        <p className="mt-4 text-sm text-gray-500">Setting up your account...</p>
      </div>
    </div>
  )
}
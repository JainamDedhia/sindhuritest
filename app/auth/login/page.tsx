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
}

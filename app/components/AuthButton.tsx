"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="w-20 h-4 bg-gray-300 rounded" />
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-black text-white rounded text-sm"
      >
        Sign in
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">
        Hi, {session.user?.name?.split(" ")[0]}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-3 py-1 bg-gray-300 rounded text-sm"
      >
        Sign out
      </button>
    </div>
  )
}

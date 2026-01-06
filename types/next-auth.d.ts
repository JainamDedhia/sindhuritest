import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      hasCompletedProfile?: boolean
      phone?: string
    } & DefaultSession["user"]
  }

  interface User {
    hasCompletedProfile?: boolean
    phone?: string
  }
}
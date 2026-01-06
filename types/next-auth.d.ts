import { DefaultSession, DefaultJWT } from "next-auth"
import { JWT } from "next-auth/jwt"

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

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    hasCompletedProfile?: boolean
    phone?: string
  }
}
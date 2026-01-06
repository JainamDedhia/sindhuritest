import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const authResult = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Add custom fields to session
        session.user.hasCompletedProfile = user.hasCompletedProfile || false
        session.user.phone = user.phone
      }
      return session
    },
  },

  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        console.log("🎉 New user signed up:", user.email);
      }
    },
  },

  debug: true,
})

export const GET = authResult.handlers.GET
export const POST = authResult.handlers.POST
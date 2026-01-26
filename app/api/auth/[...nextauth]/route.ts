// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const { handlers, auth, signIn, signOut } = NextAuth({
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

  // 🔥 FIX: Explicitly configure cookies for consistency
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? `__Secure-authjs.session-token`
        : `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },

  debug: process.env.NODE_ENV === "development",
})

export { auth }
export const GET = handlers.GET
export const POST = handlers.POST

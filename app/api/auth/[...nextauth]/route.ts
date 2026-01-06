// app/api/auth/[...nextauth]/route.ts
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
    // ✅ Session callback (for useSession hook)
    async session({ session, user }) {
      if (session.user) {
        const freshUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            hasCompletedProfile: true,
            phone: true,
            name: true,
            email: true,
            image: true,
          }
        });

        if (freshUser) {
          session.user.id = freshUser.id;
          session.user.hasCompletedProfile = freshUser.hasCompletedProfile;
          session.user.phone = freshUser.phone;
          session.user.name = freshUser.name;
          session.user.email = freshUser.email;
          session.user.image = freshUser.image;
        }

        console.log("📋 Session callback:", {
          userId: freshUser?.id,
          email: freshUser?.email,
          hasCompletedProfile: freshUser?.hasCompletedProfile
        });
      }
      return session;
    },

    // ✅ JWT callback (for getToken in middleware)
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.hasCompletedProfile = user.hasCompletedProfile || false;
        token.phone = user.phone;
      }

      // When session is updated (from update() call)
      if (trigger === "update" && session) {
        token.hasCompletedProfile = session.hasCompletedProfile;
        token.phone = session.phone;
      }

      // Always fetch fresh data for middleware checks
      if (token.email) {
        const freshUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            hasCompletedProfile: true,
            phone: true,
          }
        });

        if (freshUser) {
          token.hasCompletedProfile = freshUser.hasCompletedProfile;
          token.phone = freshUser.phone;
        }
      }

      console.log("🔑 JWT callback:", {
        email: token.email,
        hasCompletedProfile: token.hasCompletedProfile
      });

      return token;
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
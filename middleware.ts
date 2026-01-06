import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  console.log("🔒 Middleware check:", { pathname })

  // === ADMIN ROUTES ===
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    const adminSession = request.cookies.get("admin_session")?.value

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    return NextResponse.next()
  }

  // === PUBLIC ROUTES (NO AUTH CHECK) ===
  const publicPaths = [
    "/", 
    "/products", 
    "/about", 
    "/contact", 
    "/auth/login",
    "/auth/check-profile",
    "/auth/complete-profile",
    "/terms",
    "/privacy",
    "/api",
    "/_next",
    "/favicon.ico"
  ]

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/") || pathname.startsWith(path)
  )

  if (isPublic) {
    return NextResponse.next()
  }

  // === USER PROTECTED ROUTES ===
  const userProtectedPaths = ["/wishlist", "/cart", "/profile"]

  const isUserProtected = userProtectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isUserProtected) {
    // ✅ FIX: Get token properly
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    })

    console.log("🔍 Token check for protected route:", {
      pathname,
      hasToken: !!token,
      email: token?.email,
      hasCompletedProfile: token?.hasCompletedProfile
    })

    // Not logged in at all
    if (!token) {
      console.log("❌ No token found, redirecting to login")
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Logged in but profile not completed
    if (token.hasCompletedProfile === false) {
      console.log("⚠️ Profile incomplete, redirecting to complete-profile")
      return NextResponse.redirect(new URL("/auth/complete-profile", request.url))
    }

    console.log("✅ Token valid, allowing access")
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
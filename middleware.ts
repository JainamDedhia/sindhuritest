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

  // === PUBLIC ROUTES ===
  const publicPaths = [
    "/", 
    "/products", 
    "/product", 
    "/about", 
    "/contact", 
    "/auth/login",
    "/auth/check-profile", // ADD THIS
    "/auth/complete-profile", // Allow access to complete profile page
    "/terms",
    "/privacy"
  ]

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
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
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if profile is completed
    if (!token.hasCompletedProfile) {
      // Redirect to complete profile page
      return NextResponse.redirect(new URL("/auth/complete-profile", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
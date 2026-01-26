import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  console.log("🔒 Middleware check:", { pathname })

  // === ADMIN ROUTES - SEPARATE AUTHENTICATION ===
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    const adminSession = request.cookies.get("admin_session")?.value
    console.log("🔍 Admin auth check:", { hasAdminSession: !!adminSession, pathname })

    if (!adminSession) {
      console.log("❌ No admin session, redirecting to /admin/login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    console.log("✅ Admin authenticated")
    return NextResponse.next()
  }

  // === PUBLIC ROUTES ===
  const publicPaths = ["/", "/products", "/product", "/about", "/contact", "/auth/login"]
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  )

  if (isPublic) {
    console.log("✅ Public route, allowing access")
    return NextResponse.next()
  }

  // === USER PROTECTED ROUTES (Wishlist, Cart, Profile) ===
  const userProtectedPaths = ["/wishlist", "/cart", "/profile"]
  const isUserProtected = userProtectedPaths.some((path) => pathname.startsWith(path))

  if (isUserProtected) {
    // 🔥 FIX: Check for BOTH cookie names (dev and production)
    const devSessionToken = request.cookies.get("authjs.session-token")?.value
    const prodSessionToken = request.cookies.get("__Secure-authjs.session-token")?.value
    const sessionToken = devSessionToken || prodSessionToken

    console.log("🔍 User session check:", {
      hasDevToken: !!devSessionToken,
      hasProdToken: !!prodSessionToken,
      pathname,
      allCookies: request.cookies.getAll().map(c => c.name) // Debug: show all cookies
    })

    if (!sessionToken) {
      console.log("❌ No user session, redirecting to /auth/login")
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    console.log("✅ User authenticated")
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

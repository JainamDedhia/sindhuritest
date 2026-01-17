import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  

  console.log("🔒 Middleware check:", { pathname })

  // === ADMIN ROUTES - SEPARATE AUTHENTICATION ===
  if (pathname.startsWith("/admin")) {
    // Allow login page
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Check for ADMIN session (not user session)
    const adminSession = request.cookies.get("admin_session")?.value

    console.log("🔍 Admin auth check:", {
      hasAdminSession: !!adminSession,
      pathname
    })

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

  // === USER PROTECTED ROUTES (Wishlist, Cart) ===
const userProtectedPaths = ["/wishlist", "/cart", "/profile"]

  const isUserProtected = userProtectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isUserProtected) {
    // Check for NextAuth user session
    const sessionToken = request.cookies.get("authjs.session-token")?.value

    console.log("🔍 User session check:", {
      hasSessionToken: !!sessionToken,
      pathname
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
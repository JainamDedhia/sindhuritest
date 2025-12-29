import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  console.log("🔒 Middleware check:", { pathname })

  // Public routes - accessible to everyone
  const publicPaths = ["/", "/products", "/product", "/auth/login"]

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  )

  if (isPublic) {
    console.log("✅ Public route, allowing access")
    return NextResponse.next()
  }

  // Protected routes - require authentication
  const protectedPaths = ["/wishlist", "/cart", "/admin"]

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtected) {
    // Check for NextAuth session cookie (the actual session token)
    const sessionToken = request.cookies.get("authjs.session-token")?.value

    console.log("🔍 Session token check:", {
      hasSessionToken: !!sessionToken,
      cookieName: "authjs.session-token",
      allCookies: request.cookies.getAll().map(c => c.name)
    })

    if (!sessionToken) {
      console.log("❌ No session token, redirecting to login")
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    console.log("✅ Session token found, access granted")
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
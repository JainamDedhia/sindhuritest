import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  console.log("🔒 Middleware check:", { pathname })

  // === ONLY ADMIN ROUTES - DON'T CHECK USER ROUTES ===
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      console.log("✅ Admin login page, allowing access")
      return NextResponse.next()
    }

    const adminSession = request.cookies.get("admin_session")?.value

    if (!adminSession) {
      console.log("❌ No admin session, redirecting to /admin/login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    console.log("✅ Admin authenticated")
  }

  // 🔥 DON'T CHECK USER AUTH IN MIDDLEWARE - LET CLIENT HANDLE IT
  console.log("✅ Allowing access (non-admin route)")
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only run on admin routes to avoid cookie issues
    "/admin/:path*",
  ],
}

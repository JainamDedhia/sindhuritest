// middleware.ts - FIXED VERSION (No more deprecation warning)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // === ONLY ADMIN ROUTES - DON'T CHECK USER ROUTES ===
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    const adminSession = request.cookies.get("admin_session")?.value

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only run on admin routes
    "/admin/:path*",
  ],
}
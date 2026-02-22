// proxy.ts (Next.js 16 equivalent of middleware.ts)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// The function MUST be named either "middleware" or exported as default
// Based on the error, Next.js expects a default export or a named export "proxy"
export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ─────────────────────────────────────────────
  // BLOCK 1: Protect /api/admin/* routes
  // These are skipped by frontend auth — server must validate
  // ─────────────────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    // Allow login/logout endpoints through (they don't require session)
    if (
      pathname === "/api/admin/login" ||
      pathname === "/api/admin/logout"
    ) {
      return NextResponse.next()
    }

    const adminSession = request.cookies.get("admin_session")?.value

    if (!adminSession || adminSession !== "authenticated") {
      // Return JSON 401 — API callers are not browsers, don't redirect
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }
  }

  // ─────────────────────────────────────────────
  // BLOCK 2: Protect /admin/* UI pages (your existing logic)
  // Redirect unauthenticated users to login page
  // ─────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    const adminSession = request.cookies.get("admin_session")?.value

    if (!adminSession || adminSession !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on admin UI pages
    "/admin/:path*",
    // Run on admin API routes — THIS WAS MISSING BEFORE
    "/api/admin/:path*",
  ],
}
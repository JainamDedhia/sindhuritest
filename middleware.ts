import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const pathname = request.nextUrl.pathname

  // Public routes
  const publicPaths = [
    "/",
    "/products",
    "/product",
    "/auth/login",
    "/api/auth",
  ]

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  )

  if (isPublic) {
    return NextResponse.next()
  }

  // Protected routes
  const protectedPaths = ["/wishlist", "/cart", "/admin"]

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

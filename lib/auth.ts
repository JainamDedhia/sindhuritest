// File: lib/auth.ts
// This file handles API authentication

import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware to check if user is authenticated
 * Use this for user-specific API routes (wishlist, cart, profile)
 */
export async function requireAuth(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token) {
    return {
      authenticated: false,
      user: null,
      error: "Unauthorized - Please sign in"
    };
  }

  return {
    authenticated: true,
    user: {
      id: token.sub,
      email: token.email,
      name: token.name,
      image: token.picture
    },
    error: null
  };
}

/**
 * Middleware to check if admin is authenticated
 * Use this for admin API routes
 */
export async function requireAdmin(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")?.value;

  if (!adminSession) {
    return {
      authenticated: false,
      error: "Unauthorized - Admin access required"
    };
  }

  return {
    authenticated: true,
    error: null
  };
}

/**
 * Helper to create error responses
 */
export function createUnauthorizedResponse(message: string = "Unauthorized") {
  return new Response(
    JSON.stringify({ 
      error: message,
      code: "UNAUTHORIZED" 
    }),
    { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    }
  );
}

export function createForbiddenResponse(message: string = "Forbidden") {
  return new Response(
    JSON.stringify({ 
      error: message,
      code: "FORBIDDEN" 
    }),
    { 
      status: 403,
      headers: { "Content-Type": "application/json" }
    }
  );
}
// app/api/user/complete-profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("authjs.session-token")?.value || 
                        cookieStore.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid session" },
        { status: 401 }
      );
    }

    const { phone, termsAccepted } = await req.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { error: "Valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "Terms must be accepted" },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phone,
        hasCompletedProfile: true,
        termsAccepted,
      },
    });

    console.log("✅ Profile completed for:", updatedUser.email);

    return NextResponse.json({
      success: true,
      message: "Profile completed successfully",
      user: {
        hasCompletedProfile: updatedUser.hasCompletedProfile,
        phone: updatedUser.phone,
      }
    });
  } catch (error: any) {
    console.error("❌ Complete profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
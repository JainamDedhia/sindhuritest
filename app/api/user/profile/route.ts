import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("authjs.session-token")?.value || 
                        cookieStore.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      phone: session.user.phone,
      hasCompletedProfile: session.user.hasCompletedProfile,
    });
  } catch (error: any) {
    console.error("❌ Fetch profile error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
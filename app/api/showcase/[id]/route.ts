import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

/* ================= DELETE (ADMIN ONLY) ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const { id } = await params;
    await prisma.showcase.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete slide: ", error);
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
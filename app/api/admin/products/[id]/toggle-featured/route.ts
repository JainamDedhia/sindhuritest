import { NextResponse,NextRequest } from "next/server";
import { toggleProductFeatured } from "@/app/lib/dal/products";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const { id } = await params;
    const { is_featured } = await req.json();

    // Call the DAL function
    await toggleProductFeatured(id, is_featured);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("TOGGLE FEATURED ERROR:", error.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
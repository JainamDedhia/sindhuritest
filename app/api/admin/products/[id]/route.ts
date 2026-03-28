import { NextRequest, NextResponse } from "next/server";
import { deleteProduct } from "@/app/lib/dal/products";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const { id } = await params;
    
    // Call the DAL function
    await deleteProduct(id);
    
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE ERROR:", error.message);
    return NextResponse.json({ error: "Delete Failed", details: error.message }, { status: 500 });
  }
}
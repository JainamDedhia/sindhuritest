import { NextResponse } from "next/server";
import { toggleProductFeatured } from "@/app/lib/dal/products";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
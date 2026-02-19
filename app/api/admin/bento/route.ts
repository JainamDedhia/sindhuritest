import { NextResponse } from "next/server";
import { getAllBentoItems, createBentoItem, deleteBentoItem } from "@/app/lib/dal/bento";
import { NextRequest } from "next/server";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

// GET: Fetch all bento items
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const items = await getAllBentoItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Add a new bento item
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const body = await req.json();
    const { title, subtitle, image_url, target_link, size, position } = body;

    const id = await createBentoItem({
      title,
      subtitle,
      image_url,
      target_link,
      size,
      position: position || 0
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("BENTO POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove item
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const { id } = await req.json();
    await deleteBentoItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
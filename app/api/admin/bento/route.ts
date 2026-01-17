import { NextResponse } from "next/server";
import { getAllBentoItems, createBentoItem, deleteBentoItem } from "@/app/lib/dal/bento";

// GET: Fetch all bento items
export async function GET() {
  try {
    const items = await getAllBentoItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Add a new bento item
export async function POST(req: Request) {
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
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await deleteBentoItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
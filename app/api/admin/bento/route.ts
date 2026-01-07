// app/api/admin/bento/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all bento items ordered by position
export async function GET() {
  try {
    const items = await prisma.bentoItem.findMany({
      orderBy: { position: "asc" },
    });
    
    return NextResponse.json(items);
  } catch (error) {
    console.error("BENTO GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Add a new bento item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, image_url, target_link, size, position } = body;
    
    const bentoItem = await prisma.bentoItem.create({
      data: {
        title,
        subtitle,
        imageUrl: image_url,
        targetLink: target_link,
        size,
        position: position || 0,
      },
    });

    return NextResponse.json({ success: true, id: bentoItem.id });
  } catch (error: any) {
    console.error("BENTO POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove item
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    
    await prisma.bentoItem.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("BENTO DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
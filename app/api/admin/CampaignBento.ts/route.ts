import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const items = await prisma.campaignBento.findMany({
      orderBy: { rank: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const { rank, title, image_url, target_link } = await req.json();

    // Since you have a UNIQUE index on rank, we can find it directly
    const existingItem = await prisma.campaignBento.findUnique({
      where: { rank: Number(rank) }
    });

    let savedItem;
    if (existingItem) {
      // Overwrite the existing slot
      savedItem = await prisma.campaignBento.update({
        where: { id: existingItem.id },
        data: { title, image_url, target_link }
      });
    } else {
      // Create a new slot
      savedItem = await prisma.campaignBento.create({
        data: { rank: Number(rank), title, image_url, target_link }
      });
    }

    return NextResponse.json(savedItem);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const rank = req.nextUrl.searchParams.get("rank");
    if (!rank) return NextResponse.json({ error: "Rank required" }, { status: 400 });

    const existingItem = await prisma.campaignBento.findUnique({
       where: { rank: Number(rank) }
    });

    if (existingItem) {
      await prisma.campaignBento.delete({ where: { id: existingItem.id } });
    }

    return NextResponse.json({ success: true, message: "Slot cleared" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.featuredBento.findMany({
      orderBy: { rank: "asc" },
      take: 3,
      select: { id: true, rank: true, title: true, image_url: true, target_link: true },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
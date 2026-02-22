import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // Ensures visitors always see fresh data

export async function GET() {
  try {
    const items = await prisma.campaignBento.findMany({
      orderBy: { rank: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch Campaign Items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
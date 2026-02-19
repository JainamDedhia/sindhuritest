import { NextResponse } from "next/server";
import { getAllBentoItems } from "@/app/lib/dal/bento";

export async function GET() {
  try {
    const items = await getAllBentoItems();
    return NextResponse.json(
      items.map(({ id, title, image_url, target_link, size, position }) => ({
        id, title, image_url, target_link, size, position,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
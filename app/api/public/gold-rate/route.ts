import { NextResponse } from "next/server";
import { getGoldRate } from "@/app/lib/dal/settings";

export async function GET() {
  try {
    const rate = await getGoldRate();
    return NextResponse.json({ rate });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rate" }, { status: 500 });
  }
}
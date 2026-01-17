import { NextResponse } from "next/server";
import { getGoldRate, setGoldRate } from "@/app/lib/dal/settings";

export async function GET() {
  try {
    const rate = await getGoldRate();
    return NextResponse.json({ rate });
  } catch (error: any) {
    console.error("Settings GET ERROR", error.message);
    return NextResponse.json({ error: "Failed to fetch rate" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { rate } = await req.json();

    if (!rate || isNaN(Number(rate))) {
      return NextResponse.json({ error: "Invalid rate" }, { status: 400 });
    }

    await setGoldRate(rate.toString());

    return NextResponse.json({ success: true, rate });
  } catch (error: any) {
    console.error("Settings POST ERROR:", error.message);
    return NextResponse.json({ error: "Failed to update rate" }, { status: 500 });
  }
}
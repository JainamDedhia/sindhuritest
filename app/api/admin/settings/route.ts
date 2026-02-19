import { NextResponse } from "next/server";
import { getGoldRate, setGoldRate } from "@/app/lib/dal/settings";
import { NextRequest } from "next/server";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const rate = await getGoldRate();
    return NextResponse.json({ rate });
  } catch (error: any) {
    console.error("Settings GET ERROR", error.message);
    return NextResponse.json({ error: "Failed to fetch rate" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
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
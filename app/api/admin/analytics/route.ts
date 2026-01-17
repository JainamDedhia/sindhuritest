import { NextResponse } from "next/server";
import { getDashboardStats } from "@/app/lib/dal/analytics";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("ANALYTICS ERROR:", error.message);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
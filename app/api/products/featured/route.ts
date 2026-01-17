import { NextResponse } from "next/server";
import { getFeaturedProducts } from "@/app/lib/dal/products";

export async function GET() {
  try {
    const products = await getFeaturedProducts(8);
    return NextResponse.json(products || []);
  } catch (error) {
    console.error("Featured products error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
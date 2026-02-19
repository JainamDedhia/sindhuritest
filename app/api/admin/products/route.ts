import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAllProductsAdmin } from "@/app/lib/dal/products";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const products = await getAllProductsAdmin();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
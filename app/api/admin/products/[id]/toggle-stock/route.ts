import { NextResponse } from "next/server";
import { toggleProductStock } from "@/app/lib/dal/products";
import { NextRequest } from "next/server";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: Props) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const { id } = await params;
    const { is_sold_out } = await req.json();

    await toggleProductStock(id, is_sold_out);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("TOGGLE STOCK ERROR: ", error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}
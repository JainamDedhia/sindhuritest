// app/api/admin/products/[id]/toggle-stock/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { is_sold_out } = await req.json();

    await prisma.product.update({
      where: { id },
      data: { 
        isSoldOut: is_sold_out,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("TOGGLE STOCK ERROR:", error.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
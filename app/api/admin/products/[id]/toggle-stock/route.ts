import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";



export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { is_sold_out } = await req.json(); // We expect the NEW status here

    await pool.query(
      `UPDATE products SET is_sold_out = $1, updated_at = NOW() WHERE id = $2`,
      [is_sold_out, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("TOGGLE STOCK ERROR:", error.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
  const { rows } = await pool.query(
    "SELECT id, name FROM categories WHERE is_active = true ORDER BY name"
  );
  return NextResponse.json(rows);
}

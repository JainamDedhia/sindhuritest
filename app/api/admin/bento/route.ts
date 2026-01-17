import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { randomUUID } from "crypto";

// GET: Fetch all bento items ordered by position
export async function GET() {
  try {
    const { rows } = await pool.query(`SELECT * FROM bento_items ORDER BY position ASC`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Add a new bento item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, image_url, target_link, size, position } = body;
    
    const id = randomUUID();
    
    await pool.query(
      `INSERT INTO bento_items (id, title, subtitle, image_url, target_link, size, position, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [id, title, subtitle, image_url, target_link, size, position || 0]
    );

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("BENTO POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove item
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await pool.query("DELETE FROM bento_items WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
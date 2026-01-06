import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { randomUUID } from "crypto";

// GET: Fetch all categories
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM categories ORDER BY created_at DESC`
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("FETCH CATEGORIES ERROR:", error.message);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Create a new category
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const id = randomUUID();

    await pool.query(
      `INSERT INTO categories (id, name, is_active, updated_at) 
       VALUES ($1, $2, true, NOW())`,
      [id, name]
    );

    return NextResponse.json({ success: true, id, name });

  } catch (error: any) {
    console.error("CREATE CATEGORY ERROR:", error.message);
    
    // Handle Unique Constraint (Duplicate Name)
    if (error.code === '23505') {
        return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// DELETE: Remove a category
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
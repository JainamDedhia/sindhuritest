import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT 
        p.id, p.name, p.weight, p.is_sold_out, c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY position ASC LIMIT 1) as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = true
      ORDER BY p.updated_at DESC
      LIMIT 8
    `);
    
    // Cache for 60 seconds so it loads fast
    return NextResponse.json(rows || []);
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
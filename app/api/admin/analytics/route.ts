import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      const [
        totalProductsRes, 
        totalCategoriesRes,
        soldOutRes
      ] = await Promise.all([
        client.query("SELECT COUNT(*) FROM products"),
        client.query("SELECT COUNT(*) FROM categories"),
        client.query("SELECT COUNT(*) FROM products WHERE is_sold_out = true"),
      ]);

      // Extract values (Postgres returns counts as strings, so we parse them)
      const data = {
        total_products: parseInt(totalProductsRes.rows[0].count || "0"),
        total_categories: parseInt(totalCategoriesRes.rows[0].count || "0"),
        sold_out: parseInt(soldOutRes.rows[0].count || "0"),
      };

      return NextResponse.json(data);

    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error("ANALYTICS ERROR:", error.message);
    return NextResponse.json({ error: "Failed to fetch real stats" }, { status: 500 });
  }
}
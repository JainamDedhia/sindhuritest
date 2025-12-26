import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

/* ================= GET PRODUCTS ================= */

export async function GET() {
  try {
    // FIXED SQL: Uses a subquery for the image to prevent duplicate rows
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.is_sold_out, 
        p.is_active, 
        c.name AS category_name,
        (
          SELECT image_url 
          FROM product_images 
          WHERE product_id = p.id 
          LIMIT 1
        ) AS image_url
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
    `;

    const { rows } = await pool.query(query);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* ================= CREATE PRODUCT ================= */
export async function POST(req: Request) {
  const body = await req.json();
  let client;

  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const productRes = await client.query(
      `
      INSERT INTO products (
        name,
        description,
        price,
        category_id,
        is_active
      )
      VALUES ($1, $2, $3, $4, true)
      RETURNING id
      `,
      [
        body.name,
        body.description || null,
        body.price,
        body.category_id || null,
      ]
    );

    const productId = productRes.rows[0].id;

    await client.query(
      `
      INSERT INTO product_images (product_id, image_url)
      VALUES ($1, $2)
      `,
      [productId, body.image_url]
    );

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (client) await client.query("ROLLBACK");

    console.error("POST PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Database error",
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

import { NextResponse } from "next/server";
import { pool } from "../../lib/db";
import { randomUUID } from "crypto";

// 1. GET: Fetch all products (NO PRICE)
export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.product_code,
        p.weight, 
        p.is_active,
        p.is_sold_out,
        c.name as category_id,
        (
          SELECT image_url FROM product_images 
          WHERE product_id = p.id 
          ORDER BY position ASC 
          LIMIT 1
        ) as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET ADMIN PRODUCTS ERROR:", error.message);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. POST: Create Product (NO PRICE)
export async function POST(req: Request) {
  const client = await pool.connect();
  
  try {
    const body = await req.json();
    const {
      name,
      description,
      weight,
      product_code,
      category_id,
      images,
    } = body;

    // Validate required fields (Removed price check)
    if (!name || !weight || !product_code || !category_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await client.query("BEGIN");

    const productId = randomUUID();
    
    // Removed 'price' from INSERT
    await client.query(
      `INSERT INTO products (
        id, name, description, weight, product_code, category_id, is_active, is_sold_out, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, true, false, NOW())`,
      [productId, name, description, weight, product_code, category_id]
    );

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageId = randomUUID();
        await client.query(
          `INSERT INTO product_images (id, product_id, image_url, position, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [imageId, productId, images[i], i]
        );
      }
    }

    await client.query("COMMIT");
    return NextResponse.json({ success: true, productId });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("CREATE PRODUCT ERROR:", error);
    if (error.code === '23505') {
       return NextResponse.json({ error: "Product code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  } finally {
    client.release();
  }
}
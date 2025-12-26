import { NextResponse } from "next/server";
import { pool } from "../../lib/db";

/* ================= GET ================= */
export async function GET() {
  const { rows } = await pool.query(`
    SELECT id, image_url, device_type, position
    FROM banners
    WHERE is_active = true
    ORDER BY position ASC, created_at ASC
  `);

  return NextResponse.json(rows);
}

/* ================= POST (UPLOAD SAVE) ================= */
export async function POST(req: Request) {
  const { image_url, device_type } = await req.json();

  if (!image_url || !device_type) {
    return NextResponse.json(
      { error: "Missing data" },
      { status: 400 }
    );
  }

  // get next position
  const { rows } = await pool.query(
    `SELECT COALESCE(MAX(position), -1) + 1 AS next
     FROM banners
     WHERE device_type = $1`,
    [device_type]
  );

  await pool.query(
    `INSERT INTO banners (image_url, device_type, position)
     VALUES ($1, $2, $3)`,
    [image_url, device_type, rows[0].next]
  );

  return NextResponse.json({ success: true });
}

/* ================= PUT (REORDER) ================= */
export async function PUT(req: Request) {
  const items = await req.json();

  for (let i = 0; i < items.length; i++) {
    await pool.query(
      `UPDATE banners SET position = $1 WHERE id = $2`,
      [i, items[i].id]
    );
  }

  return NextResponse.json({ success: true });
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await pool.query(`DELETE FROM banners WHERE id = $1`, [id]);

  return NextResponse.json({ success: true });
}

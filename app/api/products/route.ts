import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ================= GET PRODUCTS ================= */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: { name: true },
        },
        images: {
          take: 1,
          orderBy: { position: "asc" },
          select: { imageUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to match frontend expectations
    const transformed = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      is_sold_out: p.isSoldOut,
      category_name: p.category?.name || null,
      image_url: p.images[0]?.imageUrl || null,
    }));

    return NextResponse.json(transformed);
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
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: parseFloat(body.price),
        categoryId: body.category_id || null,
        images: {
          create: {
            imageUrl: body.image_url,
            position: 0,
          },
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("POST PRODUCTS ERROR:", error);
    return NextResponse.json(
      {
        error: "Database error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
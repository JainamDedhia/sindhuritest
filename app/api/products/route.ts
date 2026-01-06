import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GOLD_RATE_PER_GRAM = parseFloat(process.env.GOLD_RATE_PER_GRAM || "7000");

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

    const transformed = products.map((p) => ({
      id: p.id,
      product_code: p.productCode,
      name: p.name,
      description: p.description,
      weight: p.weight.toString(),
      calculated_price: (parseFloat(p.weight.toString()) * GOLD_RATE_PER_GRAM).toFixed(0),
      is_sold_out: p.isSoldOut,
      category_name: p.category?.name || null,
      image_url: p.images[0]?.imageUrl || null,
    }));

    console.log("✅ Products fetched:", transformed.length);
    return NextResponse.json(transformed);
  } catch (error) {
    console.error("❌ GET PRODUCTS ERROR:", error);
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

    console.log("📥 Received product data:", {
      product_code: body.product_code,
      name: body.name,
      weight: body.weight,
      image_url: body.image_url,
    });

    // Validation
    if (!body.product_code || !body.name || !body.weight || !body.image_url) {
      return NextResponse.json(
        { error: "Missing required fields: product_code, name, weight, image_url" },
        { status: 400 }
      );
    }

    // Check if product code already exists
    const existing = await prisma.product.findUnique({
      where: { productCode: body.product_code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Product code already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        productCode: body.product_code,
        name: body.name,
        description: body.description || null,
        weight: parseFloat(body.weight),
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

    console.log("✅ Product created:", product.id);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("❌ POST PRODUCTS ERROR:", error);
    return NextResponse.json(
      {
        error: "Database error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
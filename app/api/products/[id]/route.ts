import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GOLD_RATE_PER_GRAM = parseFloat(process.env.GOLD_RATE_PER_GRAM || "7000");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ✅ IMPORTANT: params is a Promise in Next.js 15
) {
  try {
    const { id } = await params; // ✅ Await the params
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
        images: {
          orderBy: { position: "asc" },
          select: { imageUrl: true, position: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const transformed = {
      id: product.id,
      product_code: product.productCode,
      name: product.name,
      description: product.description,
      weight: product.weight.toString(),
      calculated_price: (parseFloat(product.weight.toString()) * GOLD_RATE_PER_GRAM).toFixed(0),
      is_sold_out: product.isSoldOut,
      category_name: product.category?.name || null,
      image_url: product.images[0]?.imageUrl || null,
      all_images: product.images.map(img => img.imageUrl),
      price: parseFloat((parseFloat(product.weight.toString()) * GOLD_RATE_PER_GRAM).toFixed(0)), // ✅ Add this for compatibility
      title: product.name, // ✅ Add this for compatibility
      category: product.category?.name || "Jewellery", // ✅ Add this
      image: product.images[0]?.imageUrl || null, // ✅ Add this
      inStock: !product.isSoldOut, // ✅ Add this
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("❌ GET PRODUCT DETAILS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
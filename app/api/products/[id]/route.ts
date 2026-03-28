import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProductById, deleteProduct } from "@/app/lib/dal/products";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

const GOLD_RATE_PER_GRAM = parseFloat(process.env.GOLD_RATE_PER_GRAM || "7000");

/* ================= GET (PUBLIC) ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Strip internal fields — no pricing formula, no admin flags
    const transformed = {
      id: product.id,
      product_code: product.productCode,
      name: product.name,
      description: product.description,
      weight: product.weight.toString(),
      is_sold_out: product.isSoldOut,
      category_name: product.category_name,
      image_url: product.images[0]?.image_url || null,
      all_images: product.images.map((img: any) => img.image_url),
      title: product.name,
      category: product.category_name || "Jewellery",
      image: product.images[0]?.image_url || null,
      inStock: !product.isSoldOut,
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("❌ GET PRODUCT DETAILS ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

/* ================= PUT (ADMIN ONLY) ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const { id } = await params;
    const { name, description, weight, product_code, category_id, images } = await req.json();

    await prisma.product.update({
      where: { id },
      data: { name, description, weight, productCode: product_code, categoryId: category_id },
    });

    if (images && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({
          productId: id,
          imageUrl: url,
          position: index,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ error: "Update failed", details: error.message }, { status: 500 });
  }
}
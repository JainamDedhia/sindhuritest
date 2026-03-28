import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProduct, deleteProduct } from "@/app/lib/dal/products";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

/* ================= GET (PUBLIC) ================= */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { position: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    const transformed = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      weight: p.weight.toString(),
      is_sold_out: p.isSoldOut,
      // ✅ FIX: return category NAME, not the UUID
      category_name: p.category?.name ?? "Jewelry",
      image: p.images[0]?.imageUrl ?? null,
    }));

    return NextResponse.json(transformed);
  } catch (error: any) {
    console.error("GET PRODUCTS ERROR:", error.message);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

/* ================= POST (ADMIN ONLY) ================= */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const body = await req.json();

    if (!body.name || !body.description || !body.product_code || !body.category_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const productId = await createProduct({
      name: body.name,
      description: body.description,
      weight: body.weight,
      product_code: body.product_code,
      category_id: body.category_id,
      images: body.images || [],
    });

    return NextResponse.json({ message: "Product created", productId }, { status: 201 });
  } catch (error: any) {
    console.error("POST PRODUCTS ERROR:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Product code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create Product" }, { status: 500 });
  }
}

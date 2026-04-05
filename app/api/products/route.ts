import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/lib/dal/products";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

/* ================= GET (PUBLIC) — paginated ================= */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page     = Math.max(1, parseInt(searchParams.get("page")  || "1", 10));
    const limit    = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));
    const category = searchParams.get("category") || undefined;
    const search   = searchParams.get("search")   || undefined;
    const inStock  = searchParams.get("inStock");

    const where: any = { isActive: true };
    if (category) where.category = { name: category };
    if (search)
      where.OR = [
        { name:        { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    if (inStock === "true") where.isSoldOut = false;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true } },
          images:   { orderBy: { position: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip:  (page - 1) * limit,
        take:  limit,
      }),
      prisma.product.count({ where }),
    ]);

    const transformed = products.map((p) => ({
      id:            p.id,
      name:          p.name,
      description:   p.description ?? "",
      weight:        p.weight.toString(),
      is_sold_out:   p.isSoldOut,
      category_name: p.category?.name ?? "Jewelry",
      image:         p.images[0]?.imageUrl ?? null,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products:    transformed,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
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
      name:         body.name,
      description:  body.description,
      weight:       body.weight,
      product_code: body.product_code,
      category_id:  body.category_id,
      images:       body.images || [],
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
import { NextResponse } from "next/server";
import { createProduct, getAllProducts } from "@/app/lib/dal/products";

// GET: Fetch all Products
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET PRODUCTS ERROR:", error.message);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// POST: Create a new Product
export async function POST(req: Request) {
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

    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Product code already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create Product" }, { status: 500 });
  }
}
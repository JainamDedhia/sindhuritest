import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProductById, deleteProduct } from "@/app/lib/dal/products";

const GOLD_RATE_PER_GRAM = parseFloat(process.env.GOLD_RATE_PER_GRAM || "7000");

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`Deleting Product Id: ${id}`);
    
    await deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted"
    });
  } catch (error: any) {
    console.log("DELETE ERROR: ", error.message);
    return NextResponse.json(
      { error: "Delete Failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const product = await getProductById(id);

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
      category_id: product.categoryId,
      category_name: product.category_name,
      image_url: product.images[0]?.image_url || null,
      all_images: product.images.map(img => img.image_url),
      price: parseFloat((parseFloat(product.weight.toString()) * GOLD_RATE_PER_GRAM).toFixed(0)),
      title: product.name,
      category: product.category_name || "Jewellery",
      image: product.images[0]?.image_url || null,
      inStock: !product.isSoldOut,
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const { name, description, weight, product_code, category_id, images } = body;

    // Update product
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        weight,
        productCode: product_code,
        categoryId: category_id,
      }
    });

    // Update images if provided
    if (images && images.length > 0) {
      // Delete old images
      await prisma.productImage.deleteMany({
        where: { productId: id }
      });

      // Create new images
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({
          productId: id,
          imageUrl: url,
          position: index
        }))
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getAllCategories, createCategory, deleteCategory } from "@/app/lib/dal/categories";

// GET: Fetch all categories
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("FETCH CATEGORIES ERROR:", error.message);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Create a new category
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await createCategory(name);

    return NextResponse.json({ success: true, id: category.id, name: category.name });
  } catch (error: any) {
    console.error("CREATE CATEGORY ERROR:", error.message);

    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// DELETE: Remove a category
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
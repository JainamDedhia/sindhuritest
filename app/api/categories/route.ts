import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAllCategories, createCategory, deleteCategory } from "@/app/lib/dal/categories";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

/* ================= GET (PUBLIC) ================= */
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("FETCH CATEGORIES ERROR:", error.message);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

/* ================= POST (ADMIN ONLY) ================= */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await createCategory(name);
    return NextResponse.json({ success: true, id: category.id, name: category.name });
  } catch (error: any) {
    console.error("CREATE CATEGORY ERROR:", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

/* ================= DELETE (ADMIN ONLY) ================= */
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const { id } = await req.json();
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

/* ================= GET (PUBLIC) ================= */
export async function GET() {
  try {
    const slides = await prisma.showcase.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: "Failed to Fetch" }, { status: 500 });
  }
}

/* ================= POST (ADMIN ONLY) ================= */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const { title, image_url, link } = await req.json();

    if (!image_url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const newSlide = await prisma.showcase.create({
      data: { title: title || "", image_url, link: link || "", order: 0, is_active: true },
    });

    return NextResponse.json(newSlide);
  } catch (error) {
    console.error("Database Error: ", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
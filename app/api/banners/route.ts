import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

/* ================= GET BANNERS (PUBLIC) ================= */
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });

    const transformed = banners.map((b) => ({
      id: b.id,
      image_url: b.imageUrl,
      device_type: b.deviceType,
      position: b.position,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("❌ GET BANNERS ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

/* ================= POST (ADMIN ONLY) ================= */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const { image_url, device_type } = await req.json();

    if (!image_url || !device_type) {
      return NextResponse.json(
        { error: "Missing required fields: image_url, device_type" },
        { status: 400 }
      );
    }

    const maxPosition = await prisma.banner.aggregate({
      where: { deviceType: device_type },
      _max: { position: true },
    });

    const nextPosition = (maxPosition._max.position ?? -1) + 1;

    const banner = await prisma.banner.create({
      data: { imageUrl: image_url, deviceType: device_type, position: nextPosition },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error("❌ POST BANNER ERROR:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

/* ================= PUT - REORDER (ADMIN ONLY) ================= */
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const items = await req.json();

    await prisma.$transaction(
      items.map((item: any, index: number) =>
        prisma.banner.update({
          where: { id: item.id },
          data: { position: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ PUT BANNER ERROR:", error);
    return NextResponse.json({ error: "Failed to reorder banners" }, { status: 500 });
  }
}

/* ================= DELETE (ADMIN ONLY) ================= */
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);

  try {
    const { id } = await req.json();
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE BANNER ERROR:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
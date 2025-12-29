import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ================= GET BANNERS ================= */
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });

    // Transform to match frontend expectations
    const transformed = banners.map((b) => ({
      id: b.id,
      image_url: b.imageUrl,
      device_type: b.deviceType,
      position: b.position,
    }));

    console.log("✅ Fetched banners:", transformed.length);
    return NextResponse.json(transformed);
  } catch (error) {
    console.error("❌ GET BANNERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

/* ================= POST (UPLOAD NEW BANNER) ================= */
export async function POST(req: Request) {
  try {
    const { image_url, device_type } = await req.json();

    console.log("📥 Creating banner:", { image_url, device_type });

    if (!image_url || !device_type) {
      return NextResponse.json(
        { error: "Missing required fields: image_url, device_type" },
        { status: 400 }
      );
    }

    // Get the next position for this device type
    const maxPosition = await prisma.banner.aggregate({
      where: { deviceType: device_type },
      _max: { position: true },
    });

    const nextPosition = (maxPosition._max.position ?? -1) + 1;

    // Create banner
    const banner = await prisma.banner.create({
      data: {
        imageUrl: image_url,
        deviceType: device_type,
        position: nextPosition,
      },
    });

    console.log("✅ Banner created:", banner.id);
    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error("❌ POST BANNER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}

/* ================= PUT (REORDER BANNERS) ================= */
export async function PUT(req: Request) {
  try {
    const items = await req.json();

    console.log("🔄 Reordering banners:", items.length);

    // Update positions in a transaction
    await prisma.$transaction(
      items.map((item: any, index: number) =>
        prisma.banner.update({
          where: { id: item.id },
          data: { position: index },
        })
      )
    );

    console.log("✅ Banners reordered");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ PUT BANNER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to reorder banners" },
      { status: 500 }
    );
  }
}

/* ================= DELETE BANNER ================= */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    console.log("🗑️ Deleting banner:", id);

    await prisma.banner.delete({
      where: { id },
    });

    console.log("✅ Banner deleted");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE BANNER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
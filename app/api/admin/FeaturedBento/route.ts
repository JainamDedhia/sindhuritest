import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { requireAdmin, createUnauthorizedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const items = await prisma.featuredBento.findMany({
      orderBy: { rank: 'asc' },
      take: 3
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.authenticated) return createUnauthorizedResponse(admin.error ?? undefined);
  
  try {
    const contentType = req.headers.get("content-type") || "";

    // ============================================================
    // SCENARIO 1: FILE UPLOAD (multipart/form-data)
    // ============================================================
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({ error: "No file received" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "_" + file.name.replace(/\s/g, "_");
      // const uploadDir = path.join(process.cwd(), "public/uploads");

      // try {
      //   await mkdir(uploadDir, { recursive: true });
      // } catch (e) {
      //   // Ignore error if folder exists
      // }

      // await writeFile(path.join(uploadDir, filename), buffer);

      // return NextResponse.json({ 
      //   success: true, 
      //   url: `/uploads/${filename}` 
      // });
    } 
    
    // ============================================================
    // SCENARIO 2: SAVE TO DATABASE (application/json)
    // ============================================================
    else {
      const body = await req.json();
      const { rank, title, image_url, target_link } = body;

      // Check if this slot (rank) already exists
      const existingItem = await prisma.featuredBento.findFirst({
        where: { rank: rank }
      });

      let savedItem;

      if (existingItem) {
        // UPDATE existing slot
        savedItem = await prisma.featuredBento.update({
          where: { id: existingItem.id },
          data: { title, image_url, target_link }
        });
      } else {
        // CREATE new slot
        savedItem = await prisma.featuredBento.create({
          data: { rank, title, image_url, target_link }
        });
      }

      return NextResponse.json(savedItem);
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
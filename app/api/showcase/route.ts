import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try{
    const slides = await prisma.showcase.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(slides);
  }
  catch(error){
    return NextResponse.json({ error: "Failed to Fetch"}, { status: 500 });
  }
}

export async function POST(req: Request){
  try{
    const body = await req.json();
    const { title, image_url, link } = body;
    if(!image_url){
      return NextResponse.json({ error: "Image URL is required"}, { status: 400 });
    }

    console.log("Saving to DB: ", {title, image_url, link });
    const newSlide = await prisma.showcase.create({
      data: {
        title: title || "",
        image_url: image_url,
        link: link || "",
        order: 0,
        is_active: true
      }
    });
    return NextResponse.json(newSlide);
  }
  catch(error){
    console.error("Database Error: ", error);
    return NextResponse.json({ error: "Failed to save"}, { status: 500 });
  }
}
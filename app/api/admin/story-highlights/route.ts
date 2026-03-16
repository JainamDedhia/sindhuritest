import { createUnauthorizedResponse, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const admin = await requireAdmin(req);
    if(!admin.authenticated) {
        return NextResponse.json({error: "Unauthorized"}, { status: 401});
    }

    try{
        const items = await prisma.storyHighlight.findMany({orderBy: { rank: 'asc' }});
        return NextResponse.json(items);
    }
    catch(error){
        return NextResponse.json({ error: "Failed to Fetch stories"}, {status: 500});
    }
}

export async function POST(req: NextRequest){
    const admin = await requireAdmin(req);
    if(!admin.authenticated){
         return NextResponse.json({error: "Unauthorized"}, { status: 401});
    }
    try{
        const {rank , title, image_url, target_link} = await req.json();

        const existingItem = await prisma.storyHighlight.findUnique({
            where: { rank: Number(rank) }
        });

        let savedItem;

        if(existingItem){
            savedItem = await prisma.storyHighlight.update({
                where: {id: existingItem.id},
                data:{ title, image_url, target_link }
            });
        }
        else{
            savedItem = await prisma.storyHighlight.create({
                data: { rank: Number(rank), title, image_url, target_link}
            });
        }

        return NextResponse.json(savedItem);
    }
    catch(error){
        return NextResponse.json({ error: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(req: NextRequest){
    const admin = await requireAdmin(req);
    if(!admin.authenticated) {
        return NextResponse.json({error: "Unauthorized"}, { status: 401});
    }

    try{
        const rank = req.nextUrl.searchParams.get("rank");
        if(!rank) return NextResponse.json({ error: "Rank required"}, { status: 400 });

        const existingItem = await prisma.storyHighlight.findUnique({ where: { rank: Number(rank) } });
        if(existingItem){
            await prisma.storyHighlight.delete({ where: { id: existingItem.id } });
        }

        return NextResponse.json({ success: true, message: "Story cleared"});
    }
    catch(error){
        return NextResponse.json({ error: "Internal Server Error"}, {status: 500});
    }
}
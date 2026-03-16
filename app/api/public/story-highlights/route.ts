import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(){
    try{
        const items = await prisma.storyHighlight.findMany({
            orderBy: {rank: 'asc'},
        });
        return NextResponse.json(items);
    }
    catch(error){
        return NextResponse.json({ error: "Failed to Fetch Stories"}, { status: 500 });
    }
}
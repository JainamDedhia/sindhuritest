import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string}>}
){
    try{
        const { id } = await params;
        await prisma.showcase.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    }
    catch(error){
        console.error("Failed to delete slide: ", error);
        return NextResponse.json({ error: "Failed to delete slide"}, {status: 500 });

    }
}
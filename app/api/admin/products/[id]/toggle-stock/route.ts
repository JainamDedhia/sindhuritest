import { NextResponse } from "next/server";
import { toggleProductStock } from "@/app/lib/dal/products";


type Props = {
  params: Promise <{ id: string}>
};

export async function PATCH(req: Request, { params }: Props) {
  try{
    const { id } = await params;
    const { is_sold_out } = await req.json();

    await toggleProductStock(id, is_sold_out);
    return NextResponse.json({ success: true });
  }
  catch(error: any){
    console.error("TOGGLE STOCK ERROR: ",error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}
// app/api/cart/[productId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { updateCartQuantity, removeFromCart, getUserCart } from "@/app/lib/dal/cart";

// PATCH - Update quantity
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { productId } = await params;
    const { quantity } = await req.json();

    if (typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    await updateCartQuantity(session.user.id, productId, quantity);
    const items = await getUserCart(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      items,
      message: quantity === 0 ? "Item removed" : "Quantity updated" 
    });
    
  } catch (error: any) {
    console.error("Cart PATCH Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { productId } = await params;
    await removeFromCart(session.user.id, productId);
    const items = await getUserCart(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      items,
      message: "Item removed from cart" 
    });
    
  } catch (error: any) {
    console.error("Cart DELETE Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove item" },
      { status: 500 }
    );
  }
}
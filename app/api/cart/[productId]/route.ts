// app/api/cart/[productId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { updateCartQuantity, removeFromCart, getUserCart } from "@/app/lib/dal/cart";

// PATCH - Update quantity
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();
    
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

    console.log(`🔄 Updating quantity for product ${productId} to ${quantity}`);

    await updateCartQuantity(session.user.id, productId, quantity);
    const items = await getUserCart(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      items,
      message: quantity === 0 ? "Item removed" : "Quantity updated" 
    });
    
  } catch (error: any) {
    console.error("Cart PATCH Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      // Record not found
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }
    
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
  // Declare session at the top level so it's available in catch block
  let session;
  
  try {
    session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { productId } = await params;
    
    console.log(`🗑️ Removing product ${productId} from cart`);

    await removeFromCart(session.user.id, productId);
    const items = await getUserCart(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      items,
      message: "Item removed from cart" 
    });
    
  } catch (error: any) {
    console.error("Cart DELETE Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      // Record not found - this is OK, item already gone
      // session is now available here
      if (session?.user?.id) {
        const items = await getUserCart(session.user.id);
        return NextResponse.json({ 
          success: true, 
          items,
          message: "Item already removed" 
        });
      }
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to remove item" },
      { status: 500 }
    );
  }
}

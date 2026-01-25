// app/api/wishlist/[productId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { removeFromWishlist, getUserWishlist } from "@/app/lib/dal/wishlist";

// DELETE - Remove item from wishlist
export async function DELETE(
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
    
    console.log(`🗑️ Removing product ${productId} from wishlist`);

    await removeFromWishlist(session.user.id, productId);
    const items = await getUserWishlist(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      items,
      message: "Item removed from wishlist" 
    });
    
  } catch (error: any) {
    console.error("Wishlist DELETE Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      // Record not found - this is OK, item already gone
      const items = await getUserWishlist(session.user.id);
      return NextResponse.json({ 
        success: true, 
        items,
        message: "Item already removed" 
      });
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to remove item" },
      { status: 500 }
    );
  }
}
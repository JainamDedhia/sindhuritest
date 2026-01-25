// app/api/wishlist/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getUserWishlist, addToWishlist, syncLocalWishlistToDb } from "@/app/lib/dal/wishlist";

// GET - Fetch user's wishlist
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const items = await getUserWishlist(session.user.id);
    
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
    
  } catch (error: any) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist or sync local wishlist
export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const body = await req.json();

    // SYNC LOCAL WISHLIST
    if (body.syncLocal && Array.isArray(body.items)) {
      console.log(`🔄 Syncing ${body.items.length} wishlist items for user ${session.user.id}`);
      
      const items = await syncLocalWishlistToDb(session.user.id, body.items);
      
      return NextResponse.json({ 
        success: true, 
        items,
        message: "Wishlist synced successfully" 
      });
    }

    // ADD SINGLE ITEM
    if (!body.productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    console.log(`💖 Adding product ${body.productId} to wishlist for user ${session.user.id}`);

    await addToWishlist(session.user.id, body.productId);
    const items = await getUserWishlist(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      items,
      message: "Item added to wishlist" 
    });
    
  } catch (error: any) {
    console.error("Wishlist POST Error:", error);
    
    if (error.message === "Product not found") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to add item" },
      { status: 500 }
    );
  }
}
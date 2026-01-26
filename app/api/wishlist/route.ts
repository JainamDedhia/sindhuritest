// app/api/wishlist/route.ts - FIXED VERSION
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getUserWishlist, addToWishlist, syncLocalWishlistToDb } from "@/app/lib/dal/wishlist";

// GET - Fetch user's wishlist
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      console.log("❌ GET Wishlist: No session");
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    console.log("✅ GET Wishlist for user:", session.user.id);
    const items = await getUserWishlist(session.user.id);
    console.log(`📦 Returning ${items.length} wishlist items`);
    
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
    
  } catch (error: any) {
    console.error("❌ Wishlist GET Error:", error.message);
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
      console.log("❌ POST Wishlist: No session");
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("📥 POST Wishlist:", { 
      userId: session.user.id, 
      syncLocal: body.syncLocal,
      productId: body.productId,
      itemCount: body.items?.length 
    });

    // SYNC LOCAL WISHLIST
    if (body.syncLocal && Array.isArray(body.items)) {
      console.log(`🔄 Syncing ${body.items.length} wishlist items`);
      
      try {
        const items = await syncLocalWishlistToDb(session.user.id, body.items);
        console.log(`✅ Sync complete: ${items.length} items`);
        
        return NextResponse.json({ 
          success: true, 
          items,
          message: "Wishlist synced successfully" 
        });
      } catch (syncError: any) {
        console.error("❌ Sync error:", syncError.message);
        throw syncError;
      }
    }

    // ADD SINGLE ITEM
    if (!body.productId) {
      console.log("❌ Missing productId");
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    console.log(`💖 Adding product ${body.productId}`);

    await addToWishlist(session.user.id, body.productId);
    const items = await getUserWishlist(session.user.id);
    console.log(`✅ Item added, total: ${items.length}`);
    
    return NextResponse.json({ 
      success: true, 
      items,
      message: "Item added to wishlist" 
    });
    
  } catch (error: any) {
    console.error("❌ Wishlist POST Error:", error.message);
    console.error("Stack:", error.stack);
    
    if (error.message === "Product not found") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

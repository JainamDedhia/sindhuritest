// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route"; // ✅ Import from YOUR route
import { getUserCart, addToCart, syncLocalCartToDb } from "@/app/lib/dal/cart";

// GET - Fetch user's cart
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const items = await getUserCart(session.user.id);
    return NextResponse.json(items);
    
  } catch (error: any) {
    console.error("Cart GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart or sync local cart
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

    // If syncing local cart
    if (body.syncLocal && Array.isArray(body.items)) {
      const items = await syncLocalCartToDb(session.user.id, body.items);
      return NextResponse.json({ 
        success: true, 
        items,
        message: "Cart synced successfully" 
      });
    }

    // Add single item
    if (!body.productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    await addToCart(session.user.id, body.productId);
    const items = await getUserCart(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      items,
      message: "Item added to cart" 
    });
    
  } catch (error: any) {
    console.error("Cart POST Error:", error);
    
    if (error.message === "Product not found") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    if (error.message === "Product is sold out") {
      return NextResponse.json(
        { error: "This item is currently sold out" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to add item" },
      { status: 500 }
    );
  }
}
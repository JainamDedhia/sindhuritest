// app/lib/dal/cart.ts
import { prisma } from "@/lib/prisma";

// ============= GET USER CART =============
export async function getUserCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
          images: { 
            orderBy: { position: 'asc' }, 
            take: 1 
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return items
    .filter(item => item.product) // Filter out items with deleted products
    .map(item => ({
      id: item.product.id,
      title: item.product.name,
      category: item.product.category?.name || "Jewellery",
      description: item.product.description || "",
      weight: parseFloat(item.product.weight.toString()),
      image: item.product.images[0]?.imageUrl || "",
      quantity: item.quantity,
      inStock: !item.product.isSoldOut
    }));
}

// ============= ADD TO CART =============
export async function addToCart(userId: string, productId: string) {
  // Check if product exists and is in stock
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.isSoldOut) {
    throw new Error("Product is sold out");
  }

  // Use upsert to handle duplicate key errors gracefully
  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId: { 
        userId, 
        productId 
      }
    },
    update: {
      quantity: {
        increment: 1
      }
    },
    create: {
      userId,
      productId,
      quantity: 1
    }
  });

  return cartItem;
}

// ============= UPDATE QUANTITY =============
export async function updateCartQuantity(
  userId: string, 
  productId: string, 
  quantity: number
) {
  if (quantity < 1) {
    return await removeFromCart(userId, productId);
  }

  try {
    return await prisma.cartItem.update({
      where: {
        userId_productId: { userId, productId }
      },
      data: { quantity }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record not found - throw specific error
      throw new Error("Cart item not found");
    }
    throw error;
  }
}

// ============= REMOVE FROM CART =============
export async function removeFromCart(userId: string, productId: string) {
  try {
    return await prisma.cartItem.delete({
      where: {
        userId_productId: { userId, productId }
      }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record not found - this is OK
      console.log(`Cart item ${productId} already removed for user ${userId}`);
      return null;
    }
    throw error;
  }
}

// ============= CLEAR CART =============
export async function clearCart(userId: string) {
  return await prisma.cartItem.deleteMany({
    where: { userId }
  });
}

// ============= SYNC LOCAL TO DB (IMPROVED) =============
export async function syncLocalCartToDb(
  userId: string, 
  localItems: Array<{ id: string; quantity: number }>
) {
  console.log(`🔄 Starting sync for user ${userId} with ${localItems.length} items`);

  // Use transaction for atomic operation
  await prisma.$transaction(async (tx) => {
    // 1. Get current cart items from DB
    const existingItems = await tx.cartItem.findMany({
      where: { userId },
      select: { productId: true }
    });

    const existingProductIds = new Set(existingItems.map(item => item.productId));
    const localProductIds = new Set(localItems.map(item => item.id));

    // 2. Remove items that are in DB but not in local
    const toRemove = Array.from(existingProductIds).filter(id => !localProductIds.has(id));
    
    if (toRemove.length > 0) {
      await tx.cartItem.deleteMany({
        where: {
          userId,
          productId: { in: toRemove }
        }
      });
      console.log(`🗑️ Removed ${toRemove.length} items from DB`);
    }

    // 3. Upsert local items to DB
    for (const item of localItems) {
      try {
        // Verify product exists and is available
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product) {
          console.warn(`⚠️ Product ${item.id} not found, skipping`);
          continue;
        }

        if (product.isSoldOut) {
          console.warn(`⚠️ Product ${item.id} is sold out, skipping`);
          continue;
        }

        await tx.cartItem.upsert({
          where: {
            userId_productId: {
              userId,
              productId: item.id
            }
          },
          update: {
            quantity: item.quantity
          },
          create: {
            userId,
            productId: item.id,
            quantity: item.quantity
          }
        });
      } catch (err) {
        console.error(`Failed to sync item ${item.id}:`, err);
      }
    }
  });

  console.log(`✅ Sync complete for user ${userId}`);

  // Return fresh cart state
  return await getUserCart(userId);
}
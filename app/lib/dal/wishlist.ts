// app/lib/dal/wishlist.ts
import { prisma } from "@/lib/prisma";

// ============= GET USER WISHLIST =============
export async function getUserWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
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
      weight: item.product.weight.toString(),
      image: item.product.images[0]?.imageUrl || "",
      inStock: !item.product.isSoldOut
    }));
}

// ============= ADD TO WISHLIST =============
export async function addToWishlist(userId: string, productId: string) {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Use upsert to handle duplicate key errors gracefully
  const wishlistItem = await prisma.wishlistItem.upsert({
    where: {
      userId_productId: { 
        userId, 
        productId 
      }
    },
    update: {
      // Just update the timestamp
      updatedAt: new Date()
    },
    create: {
      userId,
      productId
    }
  });

  return wishlistItem;
}

// ============= REMOVE FROM WISHLIST =============
export async function removeFromWishlist(userId: string, productId: string) {
  try {
    return await prisma.wishlistItem.delete({
      where: {
        userId_productId: { userId, productId }
      }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record not found - this is OK
      console.log(`Wishlist item ${productId} already removed for user ${userId}`);
      return null;
    }
    throw error;
  }
}

// ============= TOGGLE WISHLIST =============
export async function toggleWishlist(userId: string, productId: string) {
  // Check if item exists in wishlist
  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (existing) {
    // Remove from wishlist
    await removeFromWishlist(userId, productId);
    return { action: 'removed' };
  } else {
    // Add to wishlist
    await addToWishlist(userId, productId);
    return { action: 'added' };
  }
}

// ============= CLEAR WISHLIST =============
export async function clearWishlist(userId: string) {
  return await prisma.wishlistItem.deleteMany({
    where: { userId }
  });
}

// ============= SYNC LOCAL TO DB =============
export async function syncLocalWishlistToDb(
  userId: string, 
  localItems: Array<{ id: string }>
) {
  console.log(`🔄 Starting wishlist sync for user ${userId} with ${localItems.length} items`);

  // Use transaction for atomic operation
  await prisma.$transaction(async (tx) => {
    // 1. Get current wishlist items from DB
    const existingItems = await tx.wishlistItem.findMany({
      where: { userId },
      select: { productId: true }
    });

    const existingProductIds = new Set(existingItems.map(item => item.productId));
    const localProductIds = new Set(localItems.map(item => item.id));

    // 2. Remove items that are in DB but not in local
    const toRemove = Array.from(existingProductIds).filter(id => !localProductIds.has(id));
    
    if (toRemove.length > 0) {
      await tx.wishlistItem.deleteMany({
        where: {
          userId,
          productId: { in: toRemove }
        }
      });
      console.log(`🗑️ Removed ${toRemove.length} items from wishlist DB`);
    }

    // 3. Upsert local items to DB
    for (const item of localItems) {
      try {
        // Verify product exists
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product) {
          console.warn(`⚠️ Product ${item.id} not found, skipping`);
          continue;
        }

        await tx.wishlistItem.upsert({
          where: {
            userId_productId: {
              userId,
              productId: item.id
            }
          },
          update: {
            updatedAt: new Date()
          },
          create: {
            userId,
            productId: item.id
          }
        });
      } catch (err) {
        console.error(`Failed to sync wishlist item ${item.id}:`, err);
      }
    }
  });

  console.log(`✅ Wishlist sync complete for user ${userId}`);

  // Return fresh wishlist state
  return await getUserWishlist(userId);
}

// ============= CHECK IF IN WISHLIST =============
export async function isInWishlist(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  return !!item;
}
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
          images: { orderBy: { position: 'asc' }, take: 1 }
        }
      }
    }
  });

  return items.map(item => ({
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

  // Check if item already in cart
  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (existing) {
    // Increment quantity
    return await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 }
    });
  }

  // Add new item
  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity: 1
    }
  });
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

  return await prisma.cartItem.update({
    where: {
      userId_productId: { userId, productId }
    },
    data: { quantity }
  });
}

// ============= REMOVE FROM CART =============
export async function removeFromCart(userId: string, productId: string) {
  return await prisma.cartItem.delete({
    where: {
      userId_productId: { userId, productId }
    }
  });
}

// ============= CLEAR CART =============
export async function clearCart(userId: string) {
  return await prisma.cartItem.deleteMany({
    where: { userId }
  });
}

// ============= SYNC LOCAL TO DB =============
export async function syncLocalCartToDb(
  userId: string, 
  localItems: Array<{ id: string; quantity: number }>
) {
  // Clear existing cart
  await clearCart(userId);

  // Add all items from local storage
  for (const item of localItems) {
    try {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: item.id,
          quantity: item.quantity
        }
      });
    } catch (err) {
      console.error(`Failed to sync item ${item.id}:`, err);
    }
  }

  return await getUserCart(userId);
}
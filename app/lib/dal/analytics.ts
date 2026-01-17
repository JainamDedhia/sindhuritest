import { prisma } from "@/lib/prisma";

// ============= GET DASHBOARD STATS =============
export async function getDashboardStats() {
  const [totalProducts, totalCategories, soldOut] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({
      where: { isSoldOut: true }
    })
  ]);

  return {
    total_products: totalProducts,
    total_categories: totalCategories,
    sold_out: soldOut
  };
}
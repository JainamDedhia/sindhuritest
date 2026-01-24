import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this points to your prisma client instance

export async function GET() {
  try {
    // Run all independent queries in parallel using $transaction for speed
    const [totalProducts, totalCategories, soldOutCount, totalUsers, categoriesData] = 
      await prisma.$transaction([
        
        // 1. Total Products
        prisma.product.count(),
        
        // 2. Total Categories
        prisma.category.count(),
        
        // 3. Sold Out Products (Assuming field is named 'is_sold_out' or 'isSoldOut')
        // If your schema uses camelCase, change 'is_sold_out' to 'isSoldOut'
        prisma.product.count({
          where: { isSoldOut: true } 
        }),

        // 4. Total Users
        prisma.user.count(),

        // 5. Category Breakdown for Charts
        prisma.category.findMany({
          select: {
            name: true,
            _count: {
              select: { products: true }
            }
          }
        })
      ]);

    // Format category data for the frontend chart (Sort by count descending)
    const formattedCategoryData = categoriesData
      .map((c) => ({
        name: c.name,
        count: c._count.products,
      }))
      .sort((a, b) => b.count - a.count) // Highest count first
      .slice(0, 5); // Limit to top 5 categories

    // Return exact keys expected by the React state
    return NextResponse.json({
      total_products: totalProducts,
      total_categories: totalCategories,
      sold_out: soldOutCount,
      total_users: totalUsers,
      category_data: formattedCategoryData,
    });

  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
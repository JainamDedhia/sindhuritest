import { prisma } from "@/lib/prisma";

// ============= GET ALL CATEGORIES =============
export async function getAllCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });
}

// ============= GET CATEGORY BY ID =============
export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: { id }
  });
}

// ============= CREATE CATEGORY =============
export async function createCategory(name: string) {
  return await prisma.category.create({
    data: {
      name,
      isActive: true
    }
  });
}

// ============= DELETE CATEGORY =============
export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id }
  });
}

// ============= UPDATE CATEGORY =============
export async function updateCategory(id: string, name: string) {
  await prisma.category.update({
    where: { id },
    data: { name }
  });
}
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface CreateProductData {
  name: string;
  description: string;
  weight: string;
  product_code: string;
  category_id: string;
  images: string[];
}

// ============= GET ALL PRODUCTS =============
export async function getAllProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true }
      },
      images: {
        orderBy: { position: 'asc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return products.map(p => ({
    id: p.id,
    name: p.name,
    product_code: p.productCode,
    weight: p.weight.toString(),
    is_active: p.isActive,
    is_sold_out: p.isSoldOut,
    is_featured: p.isFeatured,
    category_id: p.category?.name || null,
    image: p.images[0]?.imageUrl || null
  }));
}

// ============= GET PRODUCT BY ID =============
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { name: true }
      },
      images: {
        orderBy: { position: 'asc' }
      }
    }
  });

  if (!product) return null;

  return {
    ...product,
    category_name: product.category?.name || null,
    images: product.images.map(img => ({
      id: img.id,
      image_url: img.imageUrl,
      position: img.position
    }))
  };
}

// ============= CREATE PRODUCT =============
export async function createProduct(data: CreateProductData) {
  const { name, description, weight, product_code, category_id, images } = data;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      weight: new Prisma.Decimal(weight),
      productCode: product_code,
      categoryId: category_id,
      isActive: true,
      isSoldOut: false,
      images: {
        create: images.map((url, index) => ({
          imageUrl: url,
          position: index
        }))
      }
    }
  });

  return product.id;
}

// ============= UPDATE PRODUCT =============
export async function updateProduct(id: string, data: Partial<CreateProductData>) {
  const { name, description, weight, product_code, category_id, images } = data;

  const updateData: any = {};
  
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (weight) updateData.weight = new Prisma.Decimal(weight);
  if (product_code) updateData.productCode = product_code;
  if (category_id) updateData.categoryId = category_id;

  // Update product details
  await prisma.product.update({
    where: { id },
    data: updateData
  });

  // Update images if provided
  if (images && images.length > 0) {
    // Delete old images
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });

    // Create new images
    await prisma.productImage.createMany({
      data: images.map((url, index) => ({
        productId: id,
        imageUrl: url,
        position: index
      }))
    });
  }
}

// ============= DELETE PRODUCT =============
export async function deleteProduct(id: string) {
  // Prisma will cascade delete images automatically
  await prisma.product.delete({
    where: { id }
  });
}

// ============= TOGGLE STOCK STATUS =============
export async function toggleProductStock(id: string, isSoldOut: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isSoldOut }
  });
}

// ============= TOGGLE FEATURED STATUS =============
export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isFeatured }
  });
}

// ============= GET FEATURED PRODUCTS =============
export async function getFeaturedProducts(limit: number = 8) {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
      isActive: true
    },
    include: {
      category: {
        select: { name: true }
      },
      images: {
        orderBy: { position: 'asc' },
        take: 1
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: limit
  });

  return products.map(p => ({
    id: p.id,
    name: p.name,
    weight: p.weight.toString(),
    description: p.description || "",
    category_name: p.category?.name || "Jewellery",
    image: p.images[0]?.imageUrl || null,
    is_sold_out: p.isSoldOut
  }));
}
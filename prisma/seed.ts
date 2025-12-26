import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const ring = await prisma.category.upsert({
    where: { name: 'Rings' },
    update: {},
    create: { name: 'Rings' },
  })

  const necklace = await prisma.category.upsert({
    where: { name: 'Necklaces' },
    update: {},
    create: { name: 'Necklaces' },
  })

  // Create a test product with a Cloudinary image
  await prisma.product.create({
    data: {
      name: '22K Gold Ring',
      description: 'Beautiful handcrafted gold ring',
      price: 45000,
      categoryId: ring.id,
      images: {
        create: {
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', // Replace with your teammate's image
          position: 0,
        },
      },
    },
  })

  console.log('✅ Seeded products!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
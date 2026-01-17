import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed gold rate
  await prisma.setting.upsert({
    where: { key: 'gold_rate' },
    update: {},
    create: {
      key: 'gold_rate',
      value: '7000'
    }
  })

  console.log('✅ Seeded gold rate: 7000')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
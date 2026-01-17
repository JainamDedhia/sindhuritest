import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed initial gold rate
  await prisma.setting.upsert({
    where: { key: 'gold_rate' },
    update: {},
    create: {
      key: 'gold_rate',
      value: '7000', // Default rate
    },
  });

  console.log('✅ Settings seeded!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
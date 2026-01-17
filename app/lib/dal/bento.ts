import { prisma } from "@/lib/prisma";

interface CreateBentoData {
  title: string;
  subtitle?: string;
  image_url: string;
  target_link: string;
  size: string;
  position: number;
}

// ============= GET ALL BENTO ITEMS =============
export async function getAllBentoItems() {
  const items = await prisma.bentoItem.findMany({
    orderBy: { position: 'asc' }
  });

  return items.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    image_url: item.imageUrl,
    target_link: item.targetLink,
    size: item.size,
    position: item.position
  }));
}

// ============= CREATE BENTO ITEM =============
export async function createBentoItem(data: CreateBentoData) {
  const item = await prisma.bentoItem.create({
    data: {
      title: data.title,
      subtitle: data.subtitle,
      imageUrl: data.image_url,
      targetLink: data.target_link,
      size: data.size,
      position: data.position
    }
  });

  return item.id;
}

// ============= DELETE BENTO ITEM =============
export async function deleteBentoItem(id: string) {
  await prisma.bentoItem.delete({
    where: { id }
  });
}

// ============= UPDATE BENTO POSITIONS =============
export async function updateBentoPositions(items: { id: string; position: number }[]) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.bentoItem.update({
        where: { id: item.id },
        data: { position: item.position }
      })
    )
  );
}
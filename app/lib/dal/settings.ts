import { prisma } from "@/lib/prisma";

// ============= GET SETTING =============
export async function getSetting(key: string) {
  return await prisma.setting.findUnique({
    where: {key}
  });

}

// ============= SET SETTING =============
export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
}

// ============= GET GOLD RATE =============
export async function getGoldRate() {
  const setting = await getSetting('gold_rate');

  if(!setting){
    return {value: "7000", updatedAt: new Date()};
  }
  return setting; 
  // Default fallback
}

// ============= SET GOLD RATE =============
export async function setGoldRate(rate: string): Promise<void> {
  await setSetting('gold_rate', rate);
}

import { prisma } from "@/lib/prisma";

// ============= GET SETTING =============
export async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.setting.findUnique({
    where: { key }
  });

  return setting?.value || null;
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
export async function getGoldRate(): Promise<string> {
  const rate = await getSetting('gold_rate');
  return rate || "7000"; // Default fallback
}

// ============= SET GOLD RATE =============
export async function setGoldRate(rate: string): Promise<void> {
  await setSetting('gold_rate', rate);
}
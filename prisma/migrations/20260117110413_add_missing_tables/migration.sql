/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - Made the column `weight` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "weight" SET NOT NULL;

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bento_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "image_url" TEXT NOT NULL,
    "target_link" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT 'small',
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bento_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE INDEX "bento_items_position_idx" ON "bento_items"("position");

-- CreateIndex
CREATE INDEX "products_is_featured_idx" ON "products"("is_featured");

-- prisma/migrations/XXXXXX_create_wishlist_table/migration.sql
-- Run this if the wishlist_items table doesn't exist

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS "wishlist_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "wishlist_items_user_id_idx" ON "wishlist_items"("user_id");

-- Create unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_items_user_id_product_id_key" 
ON "wishlist_items"("user_id", "product_id");

-- Add foreign keys
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'wishlist_items_user_id_fkey'
    ) THEN
        ALTER TABLE "wishlist_items" 
        ADD CONSTRAINT "wishlist_items_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'wishlist_items_product_id_fkey'
    ) THEN
        ALTER TABLE "wishlist_items" 
        ADD CONSTRAINT "wishlist_items_product_id_fkey" 
        FOREIGN KEY ("product_id") REFERENCES "products"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
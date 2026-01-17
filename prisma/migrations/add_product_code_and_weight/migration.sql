-- Add product_code column
ALTER TABLE "products" ADD COLUMN "product_code" TEXT;

-- Add weight column
ALTER TABLE "products" ADD COLUMN "weight" DECIMAL(10,3);

-- Copy price data to weight temporarily
UPDATE "products"
SET "weight" = 1.000;

-- ✅ Generate product_code using CTE (FIX)
WITH ranked_products AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM "products"
)
UPDATE "products"
SET "product_code" =
  CONCAT('PROD-', LPAD(ranked_products.rn::TEXT, 4, '0'))
FROM ranked_products
WHERE "products".id = ranked_products.id;

-- Make product_code NOT NULL + UNIQUE
ALTER TABLE "products" ALTER COLUMN "product_code" SET NOT NULL;
ALTER TABLE "products"
ADD CONSTRAINT "products_product_code_key" UNIQUE ("product_code");

-- Create index
CREATE INDEX "products_product_code_idx"
ON "products"("product_code");

-- Optional
-- ALTER TABLE "products" DROP COLUMN "price";

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "name" CITEXT NOT NULL,
  "description" TEXT NOT NULL,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Product_name_key"
ON "Product"("name");

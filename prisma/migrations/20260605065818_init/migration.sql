-- CreateEnum
CREATE TYPE "MaterialUnit" AS ENUM ('UD', 'M', 'M2', 'M3', 'ML', 'L', 'KG');

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "material_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" "MaterialUnit" NOT NULL DEFAULT 'UD',
    "stock" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "minStock" DECIMAL(12,3),
    "costPerUnit" DECIMAL(10,2),
    "supplier" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "blurDataURL" TEXT NOT NULL,
    "gallery" TEXT[],
    "materials" TEXT[],
    "year" INTEGER NOT NULL,
    "client" TEXT NOT NULL,
    "durationWeeks" INTEGER NOT NULL,
    "tags" TEXT[],
    "challenges" TEXT[],
    "techniques" TEXT[],
    "dimensions" JSONB,
    "process" JSONB,
    "testimonial" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_name_key" ON "product_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "material_categories_name_key" ON "material_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "material_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import { z } from "zod";

export const SORT_ORDERS = ["asc", "desc"] as const;

// =============================================================================
// Productos
// =============================================================================
export const PRODUCT_SORT_FIELDS = ["name", "price", "stock", "createdAt"] as const;

export const createProductSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser positivo"),
  stock: z.number().int().min(0, "El stock no puede ser negativo").default(0),
  image: z.url("La URL de la imagen no es válida").optional().or(z.literal("")),
  categoryId: z.cuid("El ID de categoría no es válido"),
});

export const updateProductSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio").max(100),
    description: z.string().nullable(),
    price: z.number().positive("El precio debe ser positivo"),
    stock: z.number().int().min(0, "El stock no puede ser negativo"),
    image: z.url().nullable(),
    categoryId: z.cuid("El ID de categoría no es válido"),
  })
  .partial();

export const updateStockSchema = z.object({
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
});

// Schema del formulario (sin .default) para un tipado limpio con react-hook-form.
export const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  description: z.string().max(500).optional(),
  price: z.number({ error: "Introduce un precio" }).positive("El precio debe ser positivo"),
  stock: z.number({ error: "Introduce un stock" }).int().min(0, "El stock no puede ser negativo"),
  image: z.string().optional(),
  categoryId: z.cuid("Selecciona una categoría"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;

// =============================================================================
// Categorías de producto
// =============================================================================
export const createProductCategorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(60),
  description: z.string().optional(),
});

export const updateProductCategorySchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio").max(60),
    description: z.string().nullable(),
  })
  .partial();

export type CreateProductCategoryInput = z.infer<typeof createProductCategorySchema>;
export type UpdateProductCategoryInput = z.infer<typeof updateProductCategorySchema>;

// =============================================================================
// Materiales
// =============================================================================
export const MATERIAL_UNITS = ["UD", "M", "M2", "M3", "ML", "L", "KG"] as const;
export const MATERIAL_SORT_FIELDS = ["name", "stock", "createdAt"] as const;

export const createMaterialSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(120),
  description: z.string().optional(),
  unit: z.enum(MATERIAL_UNITS).default("UD"),
  stock: z.number().min(0, "El stock no puede ser negativo").default(0),
  minStock: z.number().min(0).optional(),
  costPerUnit: z.number().min(0).optional(),
  supplier: z.string().max(120).optional(),
  categoryId: z.cuid("El ID de categoría no es válido"),
});

export const updateMaterialSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio").max(120),
    description: z.string().nullable(),
    unit: z.enum(MATERIAL_UNITS),
    stock: z.number().min(0, "El stock no puede ser negativo"),
    minStock: z.number().min(0).nullable(),
    costPerUnit: z.number().min(0).nullable(),
    supplier: z.string().max(120).nullable(),
    categoryId: z.cuid("El ID de categoría no es válido"),
  })
  .partial();

export const updateMaterialStockSchema = z.object({
  stock: z.number().min(0, "El stock no puede ser negativo"),
});

export const materialFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(120),
  description: z.string().max(500).optional(),
  unit: z.enum(MATERIAL_UNITS),
  stock: z.number({ error: "Introduce el stock" }).min(0, "El stock no puede ser negativo"),
  minStock: z.number().min(0).optional(),
  costPerUnit: z.number().min(0).optional(),
  supplier: z.string().max(120).optional(),
  categoryId: z.cuid("Selecciona una categoría"),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;
export type MaterialFormValues = z.infer<typeof materialFormSchema>;

// =============================================================================
// Categorías de material
// =============================================================================
export const createMaterialCategorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(60),
  description: z.string().optional(),
});

export const updateMaterialCategorySchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio").max(60),
    description: z.string().nullable(),
  })
  .partial();

export type CreateMaterialCategoryInput = z.infer<typeof createMaterialCategorySchema>;
export type UpdateMaterialCategoryInput = z.infer<typeof updateMaterialCategorySchema>;

// =============================================================================
// Proyectos (portfolio)
// =============================================================================
export const PROJECT_CATEGORIES = [
  "Muebles a medida",
  "Restauración",
  "Carpintería estructural",
] as const;

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectFormSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .max(80)
    .regex(slugRegex, "Solo minúsculas, números y guiones"),
  title: z.string().min(1, "El título es obligatorio").max(120),
  category: z.enum(PROJECT_CATEGORIES),
  shortDescription: z.string().min(1, "La descripción corta es obligatoria").max(280),
  description: z.string().min(1, "La descripción es obligatoria"),
  image: z.url("La URL de la imagen no es válida"),
  blurDataURL: z.string().optional(),
  year: z.number().int().min(1900).max(2100),
  client: z.string().min(1, "El cliente es obligatorio").max(120),
  durationWeeks: z.number().int().min(1, "La duración debe ser de al menos 1 semana"),
  featured: z.boolean().default(false),
  // Arrays editados como texto (una línea por entrada) y normalizados en el form.
  gallery: z.array(z.url()).default([]),
  materials: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  techniques: z.array(z.string()).default([]),
});

export const createProjectSchema = projectFormSchema;
export const updateProjectSchema = projectFormSchema.partial();

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

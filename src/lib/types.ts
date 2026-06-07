// Tipos del lado cliente: la API serializa a JSON, por lo que Decimal y DateTime
// llegan como string (no como Prisma.Decimal / Date).

// ----- Productos -----
export type ProductWithCategory = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  image: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
};

export type ProductCategoryWithCount = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count: { products: number };
};

// ----- Materiales -----
export type MaterialUnit = "UD" | "M" | "M2" | "M3" | "ML" | "L" | "KG";

export type MaterialWithCategory = {
  id: string;
  name: string;
  description: string | null;
  unit: MaterialUnit;
  stock: string;
  minStock: string | null;
  costPerUnit: string | null;
  supplier: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
};

export type MaterialCategoryWithCount = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count: { materials: number };
};

// ----- Proyectos (portfolio) -----
export type ProjectListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: number;
  client: string;
  featured: boolean;
  image: string;
  updatedAt: string;
};

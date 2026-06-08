import type { ProductWithCategory, ProductCategoryWithCount } from "@/lib/types";

// Datos de prueba alineados con el dominio REAL de Taller Sagra:
// los `Product` son muebles terminados del catálogo (no materiales de taller),
// y sus categorías son las del seed: "Muebles a medida", "Restauración",
// "Complementos". El precio llega como string porque la API serializa el
// Decimal de Prisma a JSON.
export const mockCategories: ProductCategoryWithCount[] = [
  {
    id: "cat-muebles",
    name: "Muebles a medida",
    description: "Piezas de ebanistería diseñadas para cada cliente.",
    createdAt: "2024-01-01T00:00:00.000Z",
    _count: { products: 2 },
  },
  {
    id: "cat-restauracion",
    name: "Restauración",
    description: "Recuperación de muebles antiguos.",
    createdAt: "2024-01-01T00:00:00.000Z",
    _count: { products: 1 },
  },
  {
    id: "cat-complementos",
    name: "Complementos",
    description: "Pequeñas piezas de madera maciza.",
    createdAt: "2024-01-01T00:00:00.000Z",
    _count: { products: 1 },
  },
];

export function makeMockProducts(): ProductWithCategory[] {
  return [
    {
      id: "1",
      name: "Mesa de comedor en roble",
      description: "Tablero macizo de roble francés, patas de acero negro.",
      price: "1290.00",
      stock: 3,
      image: null,
      categoryId: "cat-muebles",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      category: { id: "cat-muebles", name: "Muebles a medida" },
    },
    {
      id: "2",
      name: "Aparador nórdico de nogal",
      description: "Tres puertas con tirador embutido.",
      price: "980.50",
      stock: 0,
      image: null,
      categoryId: "cat-muebles",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
      category: { id: "cat-muebles", name: "Muebles a medida" },
    },
    {
      id: "3",
      name: "Tabla de cortar de olivo",
      description: "Pieza maciza de olivo con acabado alimentario.",
      price: "34.90",
      stock: 22,
      image: null,
      categoryId: "cat-complementos",
      createdAt: "2024-01-03T00:00:00.000Z",
      updatedAt: "2024-01-03T00:00:00.000Z",
      category: { id: "cat-complementos", name: "Complementos" },
    },
  ];
}

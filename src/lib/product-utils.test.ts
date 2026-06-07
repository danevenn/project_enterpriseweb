import { describe, it, expect } from "vitest";
import { filterProducts, sortProducts, isLowStock } from "@/lib/product-utils";
import type { ProductWithCategory } from "@/lib/types";

// Muebles reales del catálogo de Carpintería Los Artesanos (no materiales de
// taller): la familia Product modela piezas terminadas. El precio es string
// porque la API serializa el Decimal de Prisma.
const mockProducts: ProductWithCategory[] = [
  {
    id: "1",
    name: "Mesa de comedor en roble",
    description: "Tablero macizo de roble francés.",
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
    description: "Pieza maciza de olivo.",
    price: "34.90",
    stock: 22,
    image: null,
    categoryId: "cat-complementos",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
    category: { id: "cat-complementos", name: "Complementos" },
  },
];

describe("filterProducts", () => {
  it("devuelve todos los productos con searchQuery vacío", () => {
    expect(filterProducts(mockProducts, "")).toHaveLength(3);
  });

  it("filtra por nombre de forma insensible a mayúsculas", () => {
    const result = filterProducts(mockProducts, "APARADOR");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Aparador nórdico de nogal");
  });

  it("devuelve array vacío cuando no hay coincidencias", () => {
    expect(filterProducts(mockProducts, "taladro")).toHaveLength(0);
  });

  it("devuelve array vacío con array de entrada vacío", () => {
    expect(filterProducts([], "roble")).toHaveLength(0);
  });

  it("no coincide con el nombre de una categoría (solo mira el name del producto)", () => {
    // "Restauración" es una categoría del seed, pero ningún producto la lleva en
    // su nombre. Igual que la API, filterProducts solo busca en el name.
    expect(filterProducts(mockProducts, "Restauración")).toHaveLength(0);
  });

  it("ignora espacios al inicio/fin de la búsqueda", () => {
    expect(filterProducts(mockProducts, "  olivo  ")).toHaveLength(1);
  });
});

describe("sortProducts", () => {
  it("ordena por precio ascendente", () => {
    const result = sortProducts(mockProducts, "price", "asc");
    expect(result.map((p) => p.id)).toEqual(["3", "2", "1"]); // 34,90 < 980,50 < 1290
  });

  it("orden descendente por precio invierte el resultado", () => {
    const asc = sortProducts(mockProducts, "price", "asc").map((p) => p.id);
    const desc = sortProducts(mockProducts, "price", "desc").map((p) => p.id);
    expect(desc).toEqual([...asc].reverse());
  });

  it("orden descendente por stock coloca primero el mayor stock", () => {
    const result = sortProducts(mockProducts, "stock", "desc");
    expect(result.map((p) => p.stock)).toEqual([22, 3, 0]);
  });

  it("ordena alfabéticamente por nombre (locale español)", () => {
    const result = sortProducts(mockProducts, "name", "asc");
    expect(result.map((p) => p.name)).toEqual([
      "Aparador nórdico de nogal",
      "Mesa de comedor en roble",
      "Tabla de cortar de olivo",
    ]);
  });

  it("ordena por fecha de creación (campo por defecto)", () => {
    const result = sortProducts(mockProducts, "createdAt", "asc");
    expect(result.map((p) => p.id)).toEqual(["1", "2", "3"]);
  });

  it("desempata por id ascendente cuando el campo es igual", () => {
    const empatados: ProductWithCategory[] = [
      { ...mockProducts[0], id: "z", price: "10.00" },
      { ...mockProducts[1], id: "a", price: "10.00" },
    ];
    // Mismo precio: el desempate por id deja "a" antes que "z" en ambos órdenes,
    // igual que el `{ id: "asc" }` secundario de la API.
    expect(sortProducts(empatados, "price", "asc").map((p) => p.id)).toEqual(["a", "z"]);
    expect(sortProducts(empatados, "price", "desc").map((p) => p.id)).toEqual(["a", "z"]);
  });

  it("no muta el array original", () => {
    const original = [...mockProducts];
    sortProducts(mockProducts, "price", "desc");
    expect(mockProducts).toEqual(original);
  });
});

describe("isLowStock", () => {
  it("devuelve true cuando el stock está por debajo del umbral", () => {
    expect(isLowStock(mockProducts[0], 10)).toBe(true); // stock=3, umbral=10
  });

  it("devuelve true cuando el stock es exactamente cero", () => {
    expect(isLowStock(mockProducts[1], 5)).toBe(true); // stock=0 (agotado)
  });

  it("devuelve false cuando el stock supera el umbral", () => {
    expect(isLowStock(mockProducts[2], 10)).toBe(false); // stock=22
  });

  it("con umbral 0 solo marca lo realmente agotado", () => {
    expect(isLowStock({ stock: 0 }, 0)).toBe(true);
    expect(isLowStock({ stock: 1 }, 0)).toBe(false);
  });

  it("trata el umbral como límite inclusivo", () => {
    expect(isLowStock({ stock: 5 }, 5)).toBe(true);
  });
});

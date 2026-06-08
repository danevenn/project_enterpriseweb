import { describe, it, expect } from "vitest";
import { isLowStock, formatMaterialStock } from "@/lib/material-utils";
import type { MaterialWithCategory } from "@/lib/types";

// Materiales reales del taller (no productos terminados): la familia Material
// modela maderas, herrajes y consumibles. stock/minStock llegan como string
// (Decimal serializado por la API).
function material(overrides: Partial<MaterialWithCategory>): MaterialWithCategory {
  return {
    id: "1",
    name: "Tablero de roble 18mm",
    description: null,
    unit: "M2",
    stock: "12",
    minStock: "5",
    costPerUnit: "42.50",
    supplier: "Maderas del Norte",
    categoryId: "cat-maderas",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    category: { id: "cat-maderas", name: "Maderas" },
    ...overrides,
  };
}

describe("isLowStock (materiales)", () => {
  it("devuelve false cuando el stock supera el mínimo", () => {
    expect(isLowStock(material({ stock: "12", minStock: "5" }))).toBe(false);
  });

  it("devuelve true cuando el stock es igual al mínimo (límite inclusivo)", () => {
    expect(isLowStock(material({ stock: "5", minStock: "5" }))).toBe(true);
  });

  it("devuelve true cuando el stock está por debajo del mínimo", () => {
    expect(isLowStock(material({ stock: "2", minStock: "5" }))).toBe(true);
  });

  it("devuelve false cuando el material no define mínimo (minStock null)", () => {
    expect(isLowStock(material({ stock: "0", minStock: null }))).toBe(false);
  });

  it("compara numéricamente, no como texto (string Decimal)", () => {
    // "9" < "10" numéricamente, pero como string "9" > "10". Debe ganar el número.
    expect(isLowStock(material({ stock: "9", minStock: "10" }))).toBe(true);
  });

  it("admite decimales (Decimal de Prisma)", () => {
    expect(isLowStock(material({ stock: "4.5", minStock: "4.75" }))).toBe(true);
    expect(isLowStock(material({ stock: "4.8", minStock: "4.75" }))).toBe(false);
  });
});

describe("formatMaterialStock", () => {
  it("muestra cantidad y unidad en minúsculas", () => {
    expect(formatMaterialStock(material({ stock: "12", unit: "M2" }))).toBe("12 m2");
  });

  it("normaliza el string Decimal a número (sin ceros de más)", () => {
    expect(formatMaterialStock(material({ stock: "8.00", unit: "KG" }))).toBe("8 kg");
  });

  it("funciona con cada unidad del enum", () => {
    expect(formatMaterialStock(material({ stock: "3", unit: "UD" }))).toBe("3 ud");
    expect(formatMaterialStock(material({ stock: "3", unit: "ML" }))).toBe("3 ml");
    expect(formatMaterialStock(material({ stock: "3", unit: "L" }))).toBe("3 l");
  });
});

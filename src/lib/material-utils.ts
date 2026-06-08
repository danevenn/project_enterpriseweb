import type { MaterialWithCategory } from "@/lib/types";

// Utilidades puras del inventario de taller (familia Material), espejo de
// `product-utils.ts` para la familia Product. Stock y mínimo llegan como string
// (serialización del Decimal de Prisma), por eso se convierten con Number antes
// de comparar. Al ser funciones puras y sin dependencias de React, son trivial
// y exhaustivamente testeables (a diferencia de la lógica embebida en la vista).

type StockFields = Pick<MaterialWithCategory, "stock" | "minStock">;
type UnitFields = Pick<MaterialWithCategory, "stock" | "unit">;

/**
 * `true` si el material está en/por debajo de su stock mínimo. A diferencia de
 * los productos (umbral global), cada material define su propio `minStock`; si
 * no lo tiene (`null`), nunca se marca como bajo.
 */
export function isLowStock(material: StockFields): boolean {
  if (material.minStock == null) return false;
  return Number(material.stock) <= Number(material.minStock);
}

/** Formatea el stock para mostrarlo: cantidad numérica + unidad en minúsculas. */
export function formatMaterialStock(material: UnitFields): string {
  return `${Number(material.stock)} ${material.unit.toLowerCase()}`;
}

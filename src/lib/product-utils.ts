import type { ProductWithCategory } from "@/lib/types";
import type { SortField, SortOrder } from "@/stores/ui-store";

/** Umbral por defecto para marcar "poco stock" en el catálogo del taller. */
export const LOW_STOCK_THRESHOLD = 5;

// Utilidades puras de inventario. Reflejan en cliente la misma semántica que la
// Route Handler aplica en servidor (Prisma): filtrado por nombre insensible a
// mayúsculas y orden por campo con desempate estable por `id`. Al ser idénticas
// al servidor, aplicarlas sobre datos ya filtrados es idempotente: sirven para
// refinar la caché al instante mientras llega la respuesta (ver ProductList).

/** Filtra por coincidencia de nombre, insensible a mayúsculas. Query vacía → todo. */
export function filterProducts<T extends Pick<ProductWithCategory, "name">>(
  products: T[],
  searchQuery: string,
): T[] {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => p.name.toLowerCase().includes(q));
}

/**
 * Ordena por el campo indicado. `price` se compara numéricamente (llega como
 * string serializado del Decimal). Desempate por `id` ascendente, igual que el
 * `orderBy: [{ [campo]: orden }, { id: "asc" }]` de la API.
 */
export function sortProducts<
  T extends Pick<ProductWithCategory, "id" | "name" | "price" | "stock" | "createdAt">,
>(products: T[], sortBy: SortField, sortOrder: SortOrder): T[] {
  const dir = sortOrder === "asc" ? 1 : -1;
  return [...products].sort((a, b) => {
    let cmp: number;
    switch (sortBy) {
      case "price":
        cmp = Number(a.price) - Number(b.price);
        break;
      case "stock":
        cmp = a.stock - b.stock;
        break;
      case "name":
        cmp = a.name.localeCompare(b.name, "es");
        break;
      default:
        cmp = a.createdAt.localeCompare(b.createdAt);
    }
    // Desempate estable por id (coincide con el segundo criterio del servidor).
    if (cmp === 0) return a.id.localeCompare(b.id);
    return cmp * dir;
  });
}

/**
 * `true` si el stock está en/por debajo del umbral. El umbral es un parámetro
 * (no hay valor mágico): con umbral 0 solo se marca lo realmente agotado.
 */
export function isLowStock(product: Pick<ProductWithCategory, "stock">, threshold: number): boolean {
  return product.stock <= threshold;
}

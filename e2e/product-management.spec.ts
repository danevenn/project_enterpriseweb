import { test, expect } from "@playwright/test";
import { InventoryPage } from "./pages/inventory.page";

// Categoría real del seed de productos (NO "Herrajes", que es de materiales).
const CATEGORY = "Muebles a medida";

test.describe("Inventario de Carpintería Los Artesanos", () => {
  test("añadir un nuevo producto aparece en la lista", async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    const name = `Taburete E2E ${Date.now()}`;
    await inventory.addProduct({ name, price: 24.9, stock: 8, category: CATEGORY });

    await expect(inventory.cardByName(name)).toBeVisible();
    // formatPrice(24.9) → "24,90 €" (el espacio puede ser estrecho: usamos regex).
    await expect(inventory.cardByName(name).getByText(/24,90/)).toBeVisible();
  });

  test("filtrar por categoría muestra solo productos de esa categoría", async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    await inventory.filterByCategory(CATEGORY);

    const categoryTags = page.getByTestId("product-category");
    // Aserciones auto-reintentables: esperan a que el refetch del servidor
    // termine (keepPreviousData muestra la lista anterior un instante).
    // 1) No debe quedar NINGUNA tarjeta de otra categoría.
    await expect(categoryTags.filter({ hasNotText: CATEGORY })).toHaveCount(0);
    // 2) Debe haber al menos una de la categoría filtrada.
    await expect(categoryTags.first()).toHaveText(CATEGORY);
  });

  test("ajustar el stock con '+' lo incrementa en 2", async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    const name = `Banco E2E ${Date.now()}`;
    await inventory.addProduct({ name, price: 120, stock: 10, category: CATEGORY });

    const before = await inventory.stockOf(name);
    await inventory.incrementStock(name, 2);
    await expect
      .poll(async () => inventory.stockOf(name))
      .toBe(before + 2);
  });
});

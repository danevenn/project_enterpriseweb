import { type Page, type Locator, expect } from "@playwright/test";

// Page Object Model del inventario de productos (/panel/productos).
// Encapsula selectores y acciones para que los specs lean como pasos de negocio
// y un cambio de UI se arregle en un único sitio.
export class InventoryPage {
  readonly page: Page;
  readonly newProductButton: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newProductButton = page.getByRole("button", { name: "Nuevo producto" });
    this.productCards = page.getByTestId("product-card");
  }

  async goto() {
    await this.page.goto("/panel/productos");
    await expect(this.newProductButton).toBeVisible();
  }

  /** Da de alta un producto desde el diálogo "Nuevo producto". */
  async addProduct(input: { name: string; price: number; stock: number; category: string }) {
    await this.newProductButton.click();
    const dialog = this.page.getByRole("dialog");
    await dialog.getByLabel("Nombre").fill(input.name);
    await dialog.getByLabel("Precio (€)").fill(String(input.price));
    await dialog.getByLabel("Stock").fill(String(input.stock));

    // Select de categoría (base-ui): abrir por el placeholder y elegir la opción.
    await dialog.getByText("Selecciona una categoría").click();
    await this.page.getByRole("option", { name: input.category }).click();

    await dialog.getByRole("button", { name: "Crear producto" }).click();
    await expect(dialog).toBeHidden();
  }

  /** Filtra el listado por el botón de categoría indicado. */
  async filterByCategory(name: string) {
    await this.page.getByRole("button", { name, exact: true }).click();
  }

  /** Tarjeta(s) cuyo contenido incluye el nombre dado. */
  cardByName(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  /** Lee el stock mostrado en una tarjeta concreta. */
  async stockOf(name: string): Promise<number> {
    const card = this.cardByName(name).first();
    const text = await card.getByTestId("product-stock").innerText();
    return Number(text.replace(/\D/g, ""));
  }

  async incrementStock(name: string, times: number) {
    const card = this.cardByName(name).first();
    const plus = card.getByRole("button", { name: "Aumentar stock" });
    for (let i = 0; i < times; i++) await plus.click();
  }

  /**
   * Borra (vía API, con la sesión del contexto) todos los productos cuyo nombre
   * coincida exactamente. Se usa en la limpieza posterior para no dejar residuo
   * de los tests en la base de datos.
   */
  async deleteProductByName(name: string) {
    const res = await this.page.request.get(
      `/api/products?search=${encodeURIComponent(name)}`,
    );
    if (!res.ok()) return;
    const products = (await res.json()) as Array<{ id: string; name: string }>;
    for (const product of products) {
      if (product.name === name) {
        await this.page.request.delete(`/api/products/${product.id}`);
      }
    }
  }
}

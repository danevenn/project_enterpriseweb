import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as stockHandler from "@/app/api/products/[id]/stock/route";
import { db } from "@/lib/db";

// El guard de escritura se mockea para permitir las mutaciones (la auth se cubre
// en src/lib/api-auth.test.ts).
vi.mock("@/lib/api-auth", () => ({ requireWriteAccess: vi.fn(async () => null) }));

// Integración del endpoint PATCH /api/products/[id]/stock. Verifica los tres
// caminos: stock válido (200), id inexistente (404) y stock negativo (400).
let categoryId: string;
let productId: string;

beforeAll(async () => {
  const category = await db.productCategory.upsert({
    where: { name: "Test-Categoría stock" },
    update: {},
    create: { name: "Test-Categoría stock" },
  });
  categoryId = category.id;
});

beforeEach(async () => {
  await db.product.deleteMany({ where: { name: { startsWith: "Test-stock" } } });
  const product = await db.product.create({
    data: { name: "Test-stock Banco de taller", price: 250, stock: 4, categoryId },
  });
  productId = product.id;
});

afterAll(async () => {
  await db.product.deleteMany({ where: { name: { startsWith: "Test-stock" } } });
  await db.productCategory.deleteMany({ where: { name: { startsWith: "Test-Categoría stock" } } });
  await db.$disconnect();
});

describe("PATCH /api/products/[id]/stock", () => {
  it("actualiza el stock y devuelve 200", async () => {
    await testApiHandler({
      appHandler: stockHandler,
      params: { id: productId },
      async test({ fetch }) {
        const res = await fetch({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: 9 }),
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.stock).toBe(9);
      },
    });
  });

  it("devuelve 404 con un id inexistente", async () => {
    await testApiHandler({
      appHandler: stockHandler,
      params: { id: "clz0000000000000000000000" },
      async test({ fetch }) {
        const res = await fetch({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: 3 }),
        });
        expect(res.status).toBe(404);
      },
    });
  });

  it("devuelve 400 con stock negativo", async () => {
    await testApiHandler({
      appHandler: stockHandler,
      params: { id: productId },
      async test({ fetch }) {
        const res = await fetch({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: -1 }),
        });
        expect(res.status).toBe(400);
      },
    });
  });
});

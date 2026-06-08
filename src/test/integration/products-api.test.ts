import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as productsHandler from "@/app/api/products/route";
import { db } from "@/lib/db";

// El guard de escritura se mockea para permitir las mutaciones: aquí probamos la
// lógica de la Route Handler contra la BD, no la autenticación (cubierta en
// src/lib/api-auth.test.ts).
vi.mock("@/lib/api-auth", () => ({ requireWriteAccess: vi.fn(async () => null) }));

// Tests de integración REALES: ejercitan la Route Handler completa (zod +
// Prisma) contra el schema `test` de Postgres. Requieren Docker arriba y el
// schema migrado (ver .env.test). Todas las filas creadas se prefijan con
// "Test-" para poder limpiarlas sin tocar datos de desarrollo.
let categoryId: string;

beforeAll(async () => {
  const category = await db.productCategory.upsert({
    where: { name: "Test-Categoría de integración" },
    update: {},
    create: { name: "Test-Categoría de integración", description: "Solo para tests" },
  });
  categoryId = category.id;
});

beforeEach(async () => {
  await db.product.deleteMany({ where: { name: { startsWith: "Test-" } } });
});

afterAll(async () => {
  await db.product.deleteMany({ where: { name: { startsWith: "Test-" } } });
  await db.productCategory.deleteMany({ where: { name: { startsWith: "Test-" } } });
  await db.$disconnect();
});

describe("GET /api/products", () => {
  it("devuelve 200 con un array", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(200);
        expect(Array.isArray(await res.json())).toBe(true);
      },
    });
  });

  it("cada producto trae id, name, price, stock y category", async () => {
    await db.product.create({
      data: { name: "Test-Mesa de roble", price: 1290, stock: 3, categoryId },
    });
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });
        const body = (await res.json()) as Array<Record<string, unknown>>;
        const product = body.find((p) => p.name === "Test-Mesa de roble");
        expect(product).toBeDefined();
        expect(product).toMatchObject({
          id: expect.any(String),
          name: "Test-Mesa de roble",
          price: expect.anything(),
          stock: 3,
          category: expect.objectContaining({ name: expect.any(String) }),
        });
      },
    });
  });
});

describe("POST /api/products", () => {
  it("crea un producto y devuelve 201", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test-Aparador de nogal",
            price: 980.5,
            stock: 5,
            categoryId,
          }),
        });
        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.name).toBe("Test-Aparador de nogal");
        expect(body.id).toBeDefined();
        expect(body.category).toBeDefined();
      },
    });
  });

  it("devuelve 400 si el precio es negativo", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Test-Inválido", price: -10, stock: 1, categoryId }),
        });
        expect(res.status).toBe(400);
      },
    });
  });

  it("devuelve 400 si falta el nombre", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: 10, stock: 1, categoryId }),
        });
        expect(res.status).toBe(400);
      },
    });
  });

  it("devuelve 400 si la categoría no es un cuid válido", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Test-Sin categoría", price: 10, categoryId: "no-cuid" }),
        });
        expect(res.status).toBe(400);
      },
    });
  });
});

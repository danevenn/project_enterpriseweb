import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as materialsHandler from "@/app/api/materials/route";
import { db } from "@/lib/db";

// El guard de escritura se mockea para permitir las mutaciones (la auth se cubre
// en src/lib/api-auth.test.ts).
vi.mock("@/lib/api-auth", () => ({ requireWriteAccess: vi.fn(async () => null) }));

// Tests de integración REALES de la familia Material (espejo de products-api):
// ejercitan la Route Handler completa (zod + Prisma) contra el schema `test`.
// Requieren Docker arriba y el schema migrado (ver .env.test). Las filas se
// prefijan con "Test-" para limpiarlas sin tocar datos de desarrollo.
let categoryId: string;

beforeAll(async () => {
  const category = await db.materialCategory.upsert({
    where: { name: "Test-Maderas integración" },
    update: {},
    create: { name: "Test-Maderas integración", description: "Solo para tests" },
  });
  categoryId = category.id;
});

beforeEach(async () => {
  await db.material.deleteMany({ where: { name: { startsWith: "Test-" } } });
});

afterAll(async () => {
  await db.material.deleteMany({ where: { name: { startsWith: "Test-" } } });
  await db.materialCategory.deleteMany({ where: { name: { startsWith: "Test-" } } });
  await db.$disconnect();
});

describe("GET /api/materials", () => {
  it("devuelve 200 con un array", async () => {
    await testApiHandler({
      appHandler: materialsHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });
        expect(res.status).toBe(200);
        expect(Array.isArray(await res.json())).toBe(true);
      },
    });
  });

  it("cada material trae unidad y categoría", async () => {
    await db.material.create({
      data: { name: "Test-Tablero de roble", unit: "M2", stock: 12, categoryId },
    });
    await testApiHandler({
      appHandler: materialsHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });
        const body = (await res.json()) as Array<Record<string, unknown>>;
        const material = body.find((m) => m.name === "Test-Tablero de roble");
        expect(material).toMatchObject({
          id: expect.any(String),
          unit: "M2",
          category: expect.objectContaining({ name: expect.any(String) }),
        });
      },
    });
  });
});

describe("POST /api/materials", () => {
  it("crea un material y devuelve 201", async () => {
    await testApiHandler({
      appHandler: materialsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test-Bisagra de latón",
            unit: "UD",
            stock: 200,
            minStock: 50,
            categoryId,
          }),
        });
        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.name).toBe("Test-Bisagra de latón");
        expect(body.category).toBeDefined();
      },
    });
  });

  it("devuelve 400 si falta el nombre", async () => {
    await testApiHandler({
      appHandler: materialsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unit: "UD", stock: 1, categoryId }),
        });
        expect(res.status).toBe(400);
      },
    });
  });

  it("devuelve 400 con una unidad no válida", async () => {
    await testApiHandler({
      appHandler: materialsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Test-Unidad mala", unit: "TONELADAS", stock: 1, categoryId }),
        });
        expect(res.status).toBe(400);
      },
    });
  });

  it("devuelve 400 (referencia inválida) si la categoría no existe", async () => {
    await testApiHandler({
      appHandler: materialsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test-Sin categoría",
            unit: "UD",
            stock: 1,
            categoryId: "clz0000000000000000000000",
          }),
        });
        expect(res.status).toBe(400);
      },
    });
  });
});

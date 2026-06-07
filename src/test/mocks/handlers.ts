import { http, HttpResponse } from "msw";
import type { ProductWithCategory } from "@/lib/types";
import { mockCategories, makeMockProducts } from "./data";

// Estado en memoria por sesión de test. Se reinicia con resetProducts() en cada
// test para que POST/PATCH no contaminen al siguiente caso.
let products: ProductWithCategory[] = makeMockProducts();

export function resetProducts() {
  products = makeMockProducts();
}

export const handlers = [
  // GET /api/products — honra search, categoryId, sortBy y sortOrder igual que
  // la Route Handler real (filtrado y orden en el "servidor").
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const categoryId = url.searchParams.get("categoryId");
    const sortBy = url.searchParams.get("sortBy") ?? "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") ?? "desc";

    let result = products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search);
      const matchesCategory = !categoryId || p.categoryId === categoryId;
      return matchesSearch && matchesCategory;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "price") cmp = Number(a.price) - Number(b.price);
      else if (sortBy === "stock") cmp = a.stock - b.stock;
      else if (sortBy === "name") cmp = a.name.localeCompare(b.name, "es");
      else cmp = a.createdAt.localeCompare(b.createdAt);
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return HttpResponse.json(result);
  }),

  // POST /api/products — valida lo mínimo (nombre y precio) como la API real.
  http.post("/api/products", async ({ request }) => {
    const body = (await request.json()) as Partial<ProductWithCategory> & { price?: number | string };
    if (!body.name || body.price === undefined) {
      return HttpResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const categoryId = body.categoryId ?? "cat-muebles";
    const category = mockCategories.find((c) => c.id === categoryId);
    const newProduct: ProductWithCategory = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description ?? null,
      price: String(body.price),
      stock: body.stock ?? 0,
      image: body.image ?? null,
      categoryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: { id: categoryId, name: category?.name ?? "Muebles a medida" },
    };
    products.push(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // PATCH /api/products/:id/stock — ajuste de stock (200 / 404).
  http.patch("/api/products/:id/stock", async ({ params, request }) => {
    const { stock } = (await request.json()) as { stock: number };
    const product = products.find((p) => p.id === params.id);
    if (!product) return HttpResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    product.stock = stock;
    return HttpResponse.json(product);
  }),

  // GET /api/product-categories — devuelve la forma con _count, como la real.
  http.get("/api/product-categories", () => HttpResponse.json(mockCategories)),
];

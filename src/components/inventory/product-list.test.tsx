import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { ProductList } from "@/components/inventory/product-list";
import { server } from "@/test/mocks/server";
import { createWrapper } from "@/test/utils";

describe("ProductList", () => {
  it("muestra los productos recibidos de la API", async () => {
    render(<ProductList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Mesa de comedor en roble")).toBeInTheDocument();
      expect(screen.getByText("Aparador nórdico de nogal")).toBeInTheDocument();
      expect(screen.getByText("Tabla de cortar de olivo")).toBeInTheDocument();
    });
  });

  it("muestra un indicador de carga mientras fetchea", () => {
    render(<ProductList />, { wrapper: createWrapper() });
    // El grid de skeletons expone role="status" + aria-busy (región accesible).
    expect(screen.getByRole("status", { name: "Cargando productos" })).toBeInTheDocument();
  });

  it("marca con 'Poco stock' los productos por debajo del umbral", async () => {
    render(<ProductList />, { wrapper: createWrapper() });
    // "Mesa de comedor en roble" tiene stock 3 (< umbral 5) y no está agotada.
    await waitFor(() => {
      expect(screen.getAllByTestId("low-stock-badge").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("muestra un estado de error con botón de reintento si la red falla", async () => {
    server.use(http.get("/api/products", () => HttpResponse.error()));
    render(<ProductList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
    });
  });

  it("muestra vacío cuando la API no devuelve productos", async () => {
    server.use(http.get("/api/products", () => HttpResponse.json([])));
    render(<ProductList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByText("No hay productos que coincidan con los filtros."),
      ).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "@/components/category-filter";
import { useUIStore } from "@/stores/ui-store";
import { createWrapper } from "@/test/utils";

describe("CategoryFilter", () => {
  beforeEach(() => useUIStore.setState(useUIStore.getInitialState()));

  it("renderiza 'Todas' y una opción por cada categoría de la API", async () => {
    render(<CategoryFilter />, { wrapper: createWrapper() });

    expect(screen.getByRole("button", { name: "Todas" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Muebles a medida" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Restauración" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Complementos" })).toBeInTheDocument();
    });
  });

  it("al pulsar una categoría la fija en el store", async () => {
    const user = userEvent.setup();
    render(<CategoryFilter />, { wrapper: createWrapper() });

    const button = await screen.findByRole("button", { name: "Muebles a medida" });
    await user.click(button);

    expect(useUIStore.getState().selectedCategoryId).toBe("cat-muebles");
  });

  it("al pulsar 'Todas' vuelve a deseleccionar la categoría", async () => {
    const user = userEvent.setup();
    render(<CategoryFilter />, { wrapper: createWrapper() });

    await user.click(await screen.findByRole("button", { name: "Complementos" }));
    expect(useUIStore.getState().selectedCategoryId).toBe("cat-complementos");

    await user.click(screen.getByRole("button", { name: "Todas" }));
    expect(useUIStore.getState().selectedCategoryId).toBeNull();
  });
});

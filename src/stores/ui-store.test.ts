import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUIStore } from "@/stores/ui-store";

// El store usa el middleware `persist`. getInitialState() (zustand v5) devuelve
// el estado base; lo restauramos antes de cada test para aislar los casos.
describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState(useUIStore.getInitialState());
  });

  it("el estado inicial tiene searchQuery vacío y ninguna categoría seleccionada", () => {
    const { result } = renderHook(() => useUIStore());
    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategoryId).toBeNull();
  });

  it("el orden inicial es por fecha de creación descendente", () => {
    const { result } = renderHook(() => useUIStore());
    expect(result.current.sortBy).toBe("createdAt");
    expect(result.current.sortOrder).toBe("desc");
  });

  it("selectCategory fija la categoría seleccionada", () => {
    const { result } = renderHook(() => useUIStore());
    act(() => result.current.selectCategory("cat-muebles"));
    expect(result.current.selectedCategoryId).toBe("cat-muebles");
  });

  it("setSearchQuery actualiza el texto de búsqueda", () => {
    const { result } = renderHook(() => useUIStore());
    act(() => result.current.setSearchQuery("roble"));
    expect(result.current.searchQuery).toBe("roble");
  });

  it("resetFilters devuelve todos los filtros a sus valores iniciales", () => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.selectCategory("cat-muebles");
      result.current.setSearchQuery("roble");
      result.current.setSortBy("price");
      result.current.setSortOrder("asc");
    });
    act(() => result.current.resetFilters());
    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategoryId).toBeNull();
    expect(result.current.sortBy).toBe("createdAt");
    expect(result.current.sortOrder).toBe("desc");
  });
});

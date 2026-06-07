import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductCategoryWithCount } from "@/lib/types";
import type {
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
} from "@/lib/validations";
import { throwApiError } from "@/lib/http";

const KEY = ["product-categories"];

export function useProductCategoriesQuery() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await fetch("/api/product-categories");
      if (!res.ok) await throwApiError(res, "Error al cargar las categorías");
      return res.json() as Promise<ProductCategoryWithCount[]>;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProductCategoryInput) => {
      const res = await fetch("/api/product-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) await throwApiError(res, "Error al crear la categoría");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateProductCategoryInput & { id: string }) => {
      const res = await fetch(`/api/product-categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) await throwApiError(res, "Error al actualizar la categoría");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/product-categories/${id}`, { method: "DELETE" });
      if (!res.ok) await throwApiError(res, "Error al borrar la categoría");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MaterialCategoryWithCount } from "@/lib/types";
import type {
  CreateMaterialCategoryInput,
  UpdateMaterialCategoryInput,
} from "@/lib/validations";
import { throwApiError } from "@/lib/http";

const KEY = ["material-categories"];

export function useMaterialCategoriesQuery() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await fetch("/api/material-categories");
      if (!res.ok) await throwApiError(res, "Error al cargar las categorías");
      return res.json() as Promise<MaterialCategoryWithCount[]>;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateMaterialCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMaterialCategoryInput) => {
      const res = await fetch("/api/material-categories", {
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

export function useUpdateMaterialCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateMaterialCategoryInput & { id: string }) => {
      const res = await fetch(`/api/material-categories/${id}`, {
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

export function useDeleteMaterialCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/material-categories/${id}`, { method: "DELETE" });
      if (!res.ok) await throwApiError(res, "Error al borrar la categoría");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

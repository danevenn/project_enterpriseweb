import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { MaterialWithCategory } from "@/lib/types";
import type { CreateMaterialInput, UpdateMaterialInput } from "@/lib/validations";
import { throwApiError } from "@/lib/http";

export type MaterialFilters = {
  search: string;
  categoryId: string | null;
  sortBy: "name" | "stock" | "createdAt";
  sortOrder: "asc" | "desc";
};

export function useMaterialsQuery(filters: MaterialFilters) {
  return useQuery({
    queryKey: ["materials", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.categoryId) params.set("categoryId", filters.categoryId);
      params.set("sortBy", filters.sortBy);
      params.set("sortOrder", filters.sortOrder);

      const res = await fetch(`/api/materials?${params.toString()}`);
      if (!res.ok) await throwApiError(res, "Error al cargar los materiales");
      return res.json() as Promise<MaterialWithCategory[]>;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateMaterialMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMaterialInput) => {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) await throwApiError(res, "Error al crear el material");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });
}

export function useUpdateMaterialMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateMaterialInput & { id: string }) => {
      const res = await fetch(`/api/materials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) await throwApiError(res, "Error al actualizar el material");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });
}

export function useDeleteMaterialMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
      if (!res.ok) await throwApiError(res, "Error al borrar el material");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });
}

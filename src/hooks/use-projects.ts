import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProjectListItem } from "@/lib/types";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/validations";
import { throwApiError } from "@/lib/http";

const KEY = ["projects"];

export function useProjectsQuery() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) await throwApiError(res, "Error al cargar los proyectos");
      return res.json() as Promise<ProjectListItem[]>;
    },
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) await throwApiError(res, "Error al crear el proyecto");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateProjectInput & { id: string }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) await throwApiError(res, "Error al actualizar el proyecto");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) await throwApiError(res, "Error al borrar el proyecto");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

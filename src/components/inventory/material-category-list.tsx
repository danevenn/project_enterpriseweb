"use client";

import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useMaterialCategoriesQuery,
  useDeleteMaterialCategoryMutation,
} from "@/hooks/use-material-categories";
import { MaterialCategoryForm } from "./material-category-form";
import type { MaterialCategoryWithCount } from "@/lib/types";

function DeleteButton({ category }: { category: MaterialCategoryWithCount }) {
  const deleteMutation = useDeleteMaterialCategoryMutation();
  const hasMaterials = category._count.materials > 0;

  return (
    <ConfirmDeleteDialog
      triggerAriaLabel="Borrar categoría"
      triggerTitle={
        hasMaterials ? "No se puede borrar: tiene materiales asociados" : "Borrar"
      }
      disabled={hasMaterials}
      title="Borrar categoría"
      description={<>¿Seguro que quieres borrar “{category.name}”?</>}
      isPending={deleteMutation.isPending}
      onConfirm={(close) =>
        deleteMutation.mutate(category.id, {
          onSuccess: () => {
            toast.success("Categoría borrada");
            close();
          },
          onError: (e) =>
            toast.error(e instanceof Error ? e.message : "Error al borrar"),
        })
      }
    />
  );
}

export function MaterialCategoryList() {
  const { data: categories, isLoading, isError, error, refetch } =
    useMaterialCategoriesQuery();

  if (isLoading) {
    return (
      <div className="space-y-2 rounded-lg border p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Error al cargar las categorías"}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        Aún no hay categorías de material.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-center">Materiales</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-muted-foreground">{c.description ?? "—"}</TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{c._count.materials}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <MaterialCategoryForm
                    category={c}
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Editar categoría">
                        <Pencil className="size-4" />
                      </Button>
                    }
                  />
                  <DeleteButton category={c} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

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
  useProductCategoriesQuery,
  useDeleteProductCategoryMutation,
} from "@/hooks/use-product-categories";
import { ProductCategoryForm } from "./product-category-form";
import type { ProductCategoryWithCount } from "@/lib/types";

function DeleteButton({ category }: { category: ProductCategoryWithCount }) {
  const deleteMutation = useDeleteProductCategoryMutation();
  const hasProducts = category._count.products > 0;

  return (
    <ConfirmDeleteDialog
      triggerAriaLabel="Borrar categoría"
      triggerTitle={
        hasProducts ? "No se puede borrar: tiene productos asociados" : "Borrar"
      }
      disabled={hasProducts}
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

export function ProductCategoryList() {
  const { data: categories, isLoading, isError, error, refetch } =
    useProductCategoriesQuery();

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
        Aún no hay categorías de producto.
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
            <TableHead className="text-center">Productos</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-muted-foreground">{c.description ?? "—"}</TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{c._count.products}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <ProductCategoryForm
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

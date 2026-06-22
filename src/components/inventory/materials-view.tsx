"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { isLowStock, formatMaterialStock } from "@/lib/material-utils";
import {
  useMaterialsQuery,
  useDeleteMaterialMutation,
  type MaterialFilters,
} from "@/hooks/use-materials";
import { useMaterialCategoriesQuery } from "@/hooks/use-material-categories";
import { MaterialForm } from "./material-form";
import type { MaterialWithCategory } from "@/lib/types";

const SORT_LABELS: Record<MaterialFilters["sortBy"], string> = {
  createdAt: "Fecha",
  name: "Nombre",
  stock: "Stock",
};

function DeleteButton({ material }: { material: MaterialWithCategory }) {
  const deleteMutation = useDeleteMaterialMutation();

  return (
    <ConfirmDeleteDialog
      triggerAriaLabel="Borrar material"
      title="Borrar material"
      description={
        <>
          ¿Seguro que quieres borrar “{material.name}”? Esta acción no se puede
          deshacer.
        </>
      }
      isPending={deleteMutation.isPending}
      onConfirm={(close) =>
        deleteMutation.mutate(material.id, {
          onSuccess: () => {
            toast.success("Material borrado");
            close();
          },
          onError: (e) =>
            toast.error(e instanceof Error ? e.message : "Error al borrar"),
        })
      }
    />
  );
}

export function MaterialsView() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<MaterialFilters>({
    search: "",
    categoryId: null,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Debounce de búsqueda (300ms).
  useEffect(() => {
    const id = setTimeout(
      () => setFilters((f) => ({ ...f, search: searchInput })),
      300,
    );
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data: categories } = useMaterialCategoriesQuery();
  const { data: materials, isLoading, isError, error, refetch } =
    useMaterialsQuery(filters);

  const categoryItems = useMemo(
    () => ({
      all: "Todas",
      ...Object.fromEntries((categories ?? []).map((c) => [c.id, c.name])),
    }),
    [categories],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Materiales
          </h1>
          <p className="text-sm text-muted-foreground">
            Inventario de taller: maderas, herrajes, acabados y consumibles.
          </p>
        </div>
        <MaterialForm
          trigger={
            <Button className="w-full sm:w-auto">
              <Plus className="size-4" />
              Nuevo material
            </Button>
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar materiales..."
            className="pl-9"
            aria-label="Buscar materiales"
          />
        </div>

        <Select
          items={categoryItems}
          value={filters.categoryId ?? "all"}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, categoryId: v === "all" ? null : v }))
          }
        >
          <SelectTrigger className="w-[180px]" aria-label="Filtrar por categoría">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={SORT_LABELS}
          value={filters.sortBy}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, sortBy: v as MaterialFilters["sortBy"] }))
          }
        >
          <SelectTrigger className="w-[140px]" aria-label="Ordenar por">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as MaterialFilters["sortBy"][]).map((f) => (
              <SelectItem key={f} value={f}>
                {SORT_LABELS[f]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2 rounded-lg border p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Error al cargar los materiales"}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : !materials || materials.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No hay materiales que coincidan con los filtros.
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Coste</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.category.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="inline-flex items-center gap-1.5">
                      {isLowStock(m) && (
                        <TriangleAlert
                          className="size-3.5 text-amber-500"
                          aria-label="Stock bajo"
                        />
                      )}
                      {formatMaterialStock(m)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {m.costPerUnit ? formatPrice(m.costPerUnit) : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.supplier ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <MaterialForm
                        material={m}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label="Editar material">
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <DeleteButton material={m} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

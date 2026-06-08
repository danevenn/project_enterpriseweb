"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  materialFormSchema,
  MATERIAL_UNITS,
  type MaterialFormValues,
} from "@/lib/validations";
import { zodFormResolver } from "@/lib/zod-resolver";
import { useMaterialCategoriesQuery } from "@/hooks/use-material-categories";
import {
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
} from "@/hooks/use-materials";
import type { MaterialWithCategory } from "@/lib/types";

const UNIT_LABELS: Record<(typeof MATERIAL_UNITS)[number], string> = {
  UD: "Unidad",
  M: "Metro lineal (m)",
  M2: "Metro cuadrado (m²)",
  M3: "Metro cúbico (m³)",
  ML: "Mililitro (ml)",
  L: "Litro (L)",
  KG: "Kilogramo (kg)",
};

// react-hook-form con inputs numéricos opcionales produce NaN al vaciarlos;
// lo normalizamos a undefined antes de enviar.
function clean(n: number | undefined): number | undefined {
  return typeof n === "number" && !Number.isNaN(n) ? n : undefined;
}

export function MaterialForm({
  material,
  trigger,
}: {
  material?: MaterialWithCategory;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(material);

  const { data: categories } = useMaterialCategoriesQuery();
  const createMutation = useCreateMaterialMutation();
  const updateMutation = useUpdateMaterialMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaterialFormValues>({
    resolver: zodFormResolver<MaterialFormValues>(materialFormSchema),
    defaultValues: {
      name: "",
      description: "",
      unit: "UD",
      stock: 0,
      supplier: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: material?.name ?? "",
      description: material?.description ?? "",
      unit: material?.unit ?? "UD",
      stock: material ? Number(material.stock) : 0,
      minStock: material?.minStock ? Number(material.minStock) : undefined,
      costPerUnit: material?.costPerUnit ? Number(material.costPerUnit) : undefined,
      supplier: material?.supplier ?? "",
      categoryId: material?.categoryId ?? "",
    });
  }, [open, material, reset]);

  const unitItems = Object.fromEntries(
    MATERIAL_UNITS.map((u) => [u, UNIT_LABELS[u]]),
  );
  const categoryItems = Object.fromEntries(
    (categories ?? []).map((c) => [c.id, c.name]),
  );

  async function onSubmit(values: MaterialFormValues) {
    const payload = {
      ...values,
      minStock: clean(values.minStock),
      costPerUnit: clean(values.costPerUnit),
      supplier: values.supplier || undefined,
      description: values.description || undefined,
    };
    try {
      if (isEdit && material) {
        await updateMutation.mutateAsync({ id: material.id, ...payload });
        toast.success("Material actualizado");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Material creado");
      }
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar material" : "Nuevo material"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos del material."
              : "Rellena los datos para registrar un material en el inventario."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mat-name">Nombre</Label>
            <Input id="mat-name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mat-desc">Descripción</Label>
            <Input id="mat-desc" {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Unidad</Label>
              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <Select items={unitItems} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIAL_UNITS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {UNIT_LABELS[u]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mat-stock">Stock</Label>
              <Input
                id="mat-stock"
                type="number"
                step="0.001"
                min="0"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="mat-min">Stock mínimo</Label>
              <Input
                id="mat-min"
                type="number"
                step="0.001"
                min="0"
                {...register("minStock", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mat-cost">Coste/unidad (€)</Label>
              <Input
                id="mat-cost"
                type="number"
                step="0.01"
                min="0"
                {...register("costPerUnit", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mat-supplier">Proveedor</Label>
            <Input id="mat-supplier" {...register("supplier")} />
          </div>

          <div className="grid gap-2">
            <Label>Categoría</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select items={categoryItems} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

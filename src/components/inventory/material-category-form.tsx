"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  createMaterialCategorySchema,
  type CreateMaterialCategoryInput,
} from "@/lib/validations";
import { zodFormResolver } from "@/lib/zod-resolver";
import {
  useCreateMaterialCategoryMutation,
  useUpdateMaterialCategoryMutation,
} from "@/hooks/use-material-categories";
import type { MaterialCategoryWithCount } from "@/lib/types";

export function MaterialCategoryForm({
  category,
  trigger,
}: {
  category?: MaterialCategoryWithCount;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(category);

  const createMutation = useCreateMaterialCategoryMutation();
  const updateMutation = useUpdateMaterialCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMaterialCategoryInput>({
    resolver: zodFormResolver<CreateMaterialCategoryInput>(createMaterialCategorySchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ name: category?.name ?? "", description: category?.description ?? "" });
  }, [open, category, reset]);

  async function onSubmit(values: CreateMaterialCategoryInput) {
    try {
      if (isEdit && category) {
        await updateMutation.mutateAsync({ id: category.id, ...values });
        toast.success("Categoría actualizada");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Categoría creada");
      }
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos de la categoría de material."
              : "Crea una nueva categoría de material."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mcat-name">Nombre</Label>
            <Input id="mcat-name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mcat-desc">Descripción</Label>
            <Input id="mcat-desc" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

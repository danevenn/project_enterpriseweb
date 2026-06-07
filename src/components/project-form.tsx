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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  projectFormSchema,
  PROJECT_CATEGORIES,
  type ProjectFormValues,
} from "@/lib/validations";
import { zodFormResolver } from "@/lib/zod-resolver";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/hooks/use-projects";
import type { ProjectListItem } from "@/lib/types";

// Cada línea no vacía es una entrada del array.
function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

type ProjectDetail = ProjectFormValues & { id: string };

export function ProjectForm({
  project,
  trigger,
}: {
  // Para crear: sin project. Para editar: el item de la lista (se cargan los
  // arrays bajo demanda al abrir vía GET /api/projects/[id]).
  project?: ProjectListItem;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(project);

  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();

  // Espejos de texto para los arrays (textarea, una línea por entrada).
  const [gallery, setGallery] = useState("");
  const [materials, setMaterials] = useState("");
  const [tags, setTags] = useState("");
  const [challenges, setChallenges] = useState("");
  const [techniques, setTechniques] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodFormResolver<ProjectFormValues>(projectFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      category: "Muebles a medida",
      shortDescription: "",
      description: "",
      image: "",
      year: new Date().getFullYear(),
      client: "",
      durationWeeks: 1,
      featured: false,
    },
  });

  // Al abrir, preparamos el formulario. En modo edición cargamos el proyecto
  // completo desde la API; en modo creación lo reseteamos a valores vacíos.
  // Toda la actualización de estado vive dentro de la función async (fuera del
  // cuerpo síncrono del effect) para no disparar renders en cascada.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      if (!project) {
        reset();
        setGallery("");
        setMaterials("");
        setTags("");
        setChallenges("");
        setTechniques("");
        return;
      }
      const res = await fetch(`/api/projects/${project.id}`);
      if (!res.ok || cancelled) return;
      const data = (await res.json()) as ProjectDetail & {
        gallery: string[];
        materials: string[];
        tags: string[];
        challenges: string[];
        techniques: string[];
      };
      reset({
        slug: data.slug,
        title: data.title,
        category: data.category as ProjectFormValues["category"],
        shortDescription: data.shortDescription,
        description: data.description,
        image: data.image,
        year: data.year,
        client: data.client,
        durationWeeks: data.durationWeeks,
        featured: data.featured,
      });
      setGallery(data.gallery.join("\n"));
      setMaterials(data.materials.join("\n"));
      setTags(data.tags.join("\n"));
      setChallenges(data.challenges.join("\n"));
      setTechniques(data.techniques.join("\n"));
    })();
    return () => {
      cancelled = true;
    };
  }, [open, project, reset]);

  const categoryItems = Object.fromEntries(PROJECT_CATEGORIES.map((c) => [c, c]));

  async function onSubmit(values: ProjectFormValues) {
    const payload = {
      ...values,
      gallery: linesToArray(gallery),
      materials: linesToArray(materials),
      tags: linesToArray(tags),
      challenges: linesToArray(challenges),
      techniques: linesToArray(techniques),
    };
    try {
      if (isEdit && project) {
        await updateMutation.mutateAsync({ id: project.id, ...payload });
        toast.success("Proyecto actualizado");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Proyecto creado");
      }
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
          <DialogDescription>
            Datos del portfolio público. Una línea por entrada en los listados.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pr-title">Título</Label>
              <Input id="pr-title" {...register("title")} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pr-slug">Slug</Label>
              <Input id="pr-slug" placeholder="mesa-roble-macizo" {...register("slug")} />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Categoría</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select items={categoryItems} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pr-year">Año</Label>
              <Input
                id="pr-year"
                type="number"
                {...register("year", { valueAsNumber: true })}
              />
              {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pr-weeks">Duración (sem.)</Label>
              <Input
                id="pr-weeks"
                type="number"
                min="1"
                {...register("durationWeeks", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pr-client">Cliente</Label>
            <Input id="pr-client" {...register("client")} />
            {errors.client && <p className="text-sm text-destructive">{errors.client.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pr-image">Imagen principal (URL)</Label>
            <Input id="pr-image" placeholder="https://…" {...register("image")} />
            {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pr-short">Descripción corta</Label>
            <Textarea id="pr-short" rows={2} {...register("shortDescription")} />
            {errors.shortDescription && (
              <p className="text-sm text-destructive">{errors.shortDescription.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pr-desc">Descripción completa</Label>
            <Textarea id="pr-desc" rows={5} {...register("description")} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pr-gallery">Galería (URLs)</Label>
              <Textarea
                id="pr-gallery"
                rows={3}
                value={gallery}
                onChange={(e) => setGallery(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pr-materials">Materiales</Label>
              <Textarea
                id="pr-materials"
                rows={3}
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pr-tags">Etiquetas</Label>
              <Textarea
                id="pr-tags"
                rows={3}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pr-challenges">Retos</Label>
              <Textarea
                id="pr-challenges"
                rows={3}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pr-techniques">Técnicas</Label>
              <Textarea
                id="pr-techniques"
                rows={3}
                value={techniques}
                onChange={(e) => setTechniques(e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="size-4" />
            Destacado en la portada
          </label>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

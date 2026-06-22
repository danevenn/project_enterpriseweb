"use client";

import { ExternalLink, Pencil, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
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
import { useProjectsQuery, useDeleteProjectMutation } from "@/hooks/use-projects";
import { ProjectForm } from "./project-form";
import type { ProjectListItem } from "@/lib/types";

function DeleteButton({ project }: { project: ProjectListItem }) {
  const deleteMutation = useDeleteProjectMutation();

  return (
    <ConfirmDeleteDialog
      triggerAriaLabel="Borrar proyecto"
      title="Borrar proyecto"
      description={
        <>
          ¿Seguro que quieres borrar “{project.title}”? Se quitará del portfolio
          público.
        </>
      }
      isPending={deleteMutation.isPending}
      onConfirm={(close) =>
        deleteMutation.mutate(project.id, {
          onSuccess: () => {
            toast.success("Proyecto borrado");
            close();
          },
          onError: (e) =>
            toast.error(e instanceof Error ? e.message : "Error al borrar"),
        })
      }
    />
  );
}

export function ProjectsView() {
  const { data: projects, isLoading, isError, error, refetch } = useProjectsQuery();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Proyectos
          </h1>
          <p className="text-sm text-muted-foreground">
            Portfolio que se muestra en la web pública.
          </p>
        </div>
        <ProjectForm
          trigger={
            <Button className="w-full sm:w-auto">
              <Plus className="size-4" />
              Nuevo proyecto
            </Button>
          }
        />
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
            {error instanceof Error ? error.message : "Error al cargar los proyectos"}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : !projects || projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Aún no hay proyectos en el portfolio.
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-center">Año</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-center">Destacado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-center tabular-nums">{p.year}</TableCell>
                  <TableCell className="text-muted-foreground">{p.client}</TableCell>
                  <TableCell className="text-center">
                    {p.featured ? (
                      <Star className="mx-auto size-4 fill-amber-400 text-amber-400" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <ButtonLink
                        href={`/proyectos/${p.slug}`}
                        target="_blank"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Ver en la web"
                      >
                        <ExternalLink className="size-4" />
                      </ButtonLink>
                      <ProjectForm
                        project={p}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label="Editar proyecto">
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <DeleteButton project={p} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Badge variant="secondary" className="font-normal">
        Nota: las dimensiones, el proceso y el testimonio se conservan al editar
        pero no son editables aún desde este formulario.
      </Badge>
    </div>
  );
}

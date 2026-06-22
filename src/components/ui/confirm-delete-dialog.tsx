"use client";

import { Trash2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Diálogo de confirmación de borrado reutilizable. Antes se redefinía un
// `DeleteButton` casi idéntico en cada vista (categorías de material/producto,
// materiales, proyectos): mismo Dialog + botón destructivo + footer
// Cancelar/Borrar. Aquí se parametriza lo que cambia (textos, estado de la
// mutación y la acción de borrado) y se centraliza la estructura.
//
// `onConfirm` recibe un `close` para cerrar el diálogo desde el `onSuccess` de
// la mutación, conservando el patrón original (cerrar solo si el borrado fue ok).
export function ConfirmDeleteDialog({
  triggerAriaLabel,
  triggerTitle,
  title,
  description,
  isPending,
  onConfirm,
  disabled = false,
}: {
  triggerAriaLabel: string;
  triggerTitle?: string;
  title: string;
  description: ReactNode;
  isPending: boolean;
  onConfirm: (close: () => void) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon-sm"
            disabled={disabled}
            title={triggerTitle}
            aria-label={triggerAriaLabel}
          >
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button
            variant="destructive"
            onClick={() => onConfirm(() => setOpen(false))}
            disabled={isPending}
          >
            {isPending ? "Borrando..." : "Borrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

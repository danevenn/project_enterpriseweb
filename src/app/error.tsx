"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app:error]", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-accent">
        Algo ha fallado
      </p>
      <h1 className="mt-3 font-heading text-4xl font-bold">
        Una astilla en la línea
      </h1>
      <p className="mt-4 text-muted-foreground">
        Se ha producido un error inesperado al cargar esta página. Puedes
        intentarlo de nuevo o volver al inicio mientras lo revisamos.
      </p>
      {error.digest && (
        <p className="mt-3 text-xs text-muted-foreground font-mono">
          ref: {error.digest}
        </p>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <ButtonLink href="/" variant="outline">
          Ir al inicio
        </ButtonLink>
      </div>
    </div>
  );
}

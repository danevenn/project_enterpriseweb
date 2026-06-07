import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-accent">404</p>
      <h1 className="mt-3 font-heading text-4xl font-bold">
        Esta pieza no está en el taller
      </h1>
      <p className="mt-4 text-muted-foreground">
        La página que buscabas no existe o ha sido movida. Vuelve al inicio
        o explora nuestra galería de proyectos.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Ir al inicio</ButtonLink>
        <ButtonLink href="/proyectos" variant="outline">
          Ver proyectos
        </ButtonLink>
      </div>
    </div>
  );
}

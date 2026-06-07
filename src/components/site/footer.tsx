import Link from "next/link";
import { Hammer, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 mt-16">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Hammer className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-semibold">
              Carpintería Los Artesanos
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Tres generaciones trabajando la madera con paciencia, técnica y
            atención al detalle.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
            Explorar
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/sobre-nosotros"
                className="text-muted-foreground hover:text-accent"
              >
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/proyectos"
                className="text-muted-foreground hover:text-accent"
              >
                Galería de proyectos
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="text-muted-foreground hover:text-accent"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
            Taller
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-accent" />
              <span>C/ del Ebanista 12 · 08001 Barcelona</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              <span>+34 933 000 000</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              <span>hola@losartesanos.es</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <p className="container mx-auto px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Carpintería Los Artesanos · Hecho con
          madera y código.
        </p>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Boxes,
  FolderTree,
  Hammer,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { href: "/panel", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/panel/materiales", label: "Materiales", icon: Boxes },
  { href: "/panel/productos", label: "Productos", icon: Package },
  { href: "/panel/proyectos", label: "Proyectos", icon: Hammer },
  { href: "/panel/categorias", label: "Categorías", icon: FolderTree },
];

// Contenido compartido entre el sidebar de escritorio y el panel móvil.
function NavContent({
  userLabel,
  onNavigate,
}: {
  userLabel: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="border-b border-border px-5 py-4">
        <Link
          href="/"
          className="font-heading text-lg font-semibold"
          onClick={onNavigate}
        >
          Los Artesanos
        </Link>
        <p className="text-xs text-muted-foreground">Panel de gestión</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <p className="truncate px-2 pb-2 text-xs text-muted-foreground" title={userLabel}>
          {userLabel}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </div>
    </>
  );
}

// Sidebar fijo en escritorio (oculto en móvil).
export function PanelSidebar({ userLabel }: { userLabel: string }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/40 md:flex">
      <NavContent userLabel={userLabel} />
    </aside>
  );
}

// Barra superior con menú en off-canvas para móvil/tablet.
export function PanelMobileBar({ userLabel }: { userLabel: string }) {
  // El menú se cierra desde cada enlace (onNavigate), por eso no necesitamos
  // un efecto que observe la ruta.
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon-sm" aria-label="Abrir menú">
              <Menu className="size-4" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menú del panel</SheetTitle>
          <div className="flex h-full flex-col">
            <NavContent userLabel={userLabel} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <span className="font-heading text-base font-semibold">Los Artesanos</span>
    </header>
  );
}

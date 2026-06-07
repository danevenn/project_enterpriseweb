import Link from "next/link";
import { Boxes, Hammer, Package, TriangleAlert } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getStats() {
  const [materials, products, projects, lowStock] = await Promise.all([
    db.material.count(),
    db.product.count(),
    db.project.count(),
    // Materiales por debajo (o en) su stock mínimo definido.
    db.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM "materials"
      WHERE "minStock" IS NOT NULL AND "stock" <= "minStock"
    `,
  ]);
  return {
    materials,
    products,
    projects,
    lowStock: Number(lowStock[0]?.count ?? 0),
  };
}

const CARDS = [
  { key: "materials", label: "Materiales", icon: Boxes, href: "/panel/materiales" },
  { key: "products", label: "Productos", icon: Package, href: "/panel/productos" },
  { key: "projects", label: "Proyectos", icon: Hammer, href: "/panel/proyectos" },
] as const;

export default async function PanelHomePage() {
  const stats = await getStats();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Resumen</h1>
        <p className="text-sm text-muted-foreground">
          Vista general del inventario y el portfolio.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map(({ key, label, icon: Icon, href }) => (
          <Link key={key} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">{stats[key]}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {stats.lowStock > 0 && (
        <Link href="/panel/materiales">
          <Card className="border-amber-300 bg-amber-50 transition-shadow hover:shadow-md dark:border-amber-900/50 dark:bg-amber-950/20">
            <CardContent className="flex items-center gap-3 py-4">
              <TriangleAlert className="size-5 text-amber-500" />
              <p className="text-sm">
                <span className="font-semibold">{stats.lowStock}</span> material(es) con
                stock por debajo del mínimo.
              </p>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
}

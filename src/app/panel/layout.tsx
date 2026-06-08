import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Eye } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { PanelMobileBar, PanelSidebar } from "@/components/panel/panel-sidebar";

// El proxy ya bloquea /panel sin sesión; aquí reforzamos en servidor y
// obtenemos los datos del usuario para la barra lateral.
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/panel");

  const userLabel = session.user?.email ?? session.user?.name ?? "Usuario";
  const isDemo =
    !!process.env.NEXT_PUBLIC_DEMO_EMAIL &&
    session.user?.email === process.env.NEXT_PUBLIC_DEMO_EMAIL;

  return (
    <div className="flex min-h-screen bg-background md:flex-row">
      <PanelSidebar userLabel={userLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PanelMobileBar userLabel={userLabel} />
        {isDemo && (
          <div
            role="status"
            className="flex items-center justify-center gap-2 border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
          >
            <Eye className="size-4 shrink-0" aria-hidden />
            <span>
              <strong>Modo demostración</strong> · puedes navegar todo el panel,
              pero los cambios no se guardan (solo lectura).
            </span>
          </div>
        )}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

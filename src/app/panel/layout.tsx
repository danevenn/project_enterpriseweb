import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
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

  return (
    <div className="flex min-h-screen bg-background md:flex-row">
      <PanelSidebar userLabel={userLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PanelMobileBar userLabel={userLabel} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

// Layout del sitio público: añade la cabecera y el pie. Las rutas de auth
// (/login, /register) y el panel (/panel) quedan fuera de este grupo y no
// muestran este chrome.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

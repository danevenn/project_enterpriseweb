"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Hammer } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();
  const { scrollY } = useScroll();

  const authLink =
    status === "authenticated"
      ? { href: "/panel", label: "Panel" }
      : { href: "/login", label: "Acceder" };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={false}
      animate={{
        height: scrolled ? 56 : 72,
        boxShadow: scrolled
          ? "0 1px 0 0 rgb(0 0 0 / 0.04), 0 8px 24px -16px rgb(0 0 0 / 0.18)"
          : "0 1px 0 0 rgb(0 0 0 / 0)",
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        scrolled ? "bg-background/95" : "bg-background/85",
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <motion.span
            animate={{ scale: scrolled ? 0.85 : 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:rotate-6"
          >
            <Hammer className="h-5 w-5" />
          </motion.span>
          <motion.span
            animate={{ fontSize: scrolled ? "1rem" : "1.125rem" }}
            transition={{ duration: 0.3 }}
            className="font-heading font-semibold tracking-tight"
          >
            Los Artesanos
          </motion.span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/link relative inline-block py-1 transition-colors",
                      active
                        ? "text-foreground"
                        : "text-foreground/70 hover:text-accent",
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute left-0 right-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover/link:scale-x-100",
                        active && "scale-x-100",
                      )}
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={authLink.href}
                className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-primary-foreground transition-colors hover:bg-primary/80"
              >
                {authLink.label}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Navegación móvil" className="md:hidden">
          <ul className="flex items-center gap-4 text-sm">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      active ? "text-accent" : "text-foreground/80",
                      "hover:text-accent",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href={authLink.href} className="font-medium text-accent">
                {authLink.label}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}

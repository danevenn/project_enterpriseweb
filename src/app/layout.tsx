import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://projectenterpriseweb.vercel.app"),
  title: {
    default: "Taller Sagra — Ebanistería de autor en La Sagra, Toledo",
    template: "%s · Taller Sagra",
  },
  description:
    "Ebanistería de autor en Illescas (La Sagra, Toledo). Muebles a medida, restauración de mobiliario antiguo y carpintería estructural con maderas nobles, entre Toledo y Madrid.",
  keywords: [
    "ebanistería",
    "muebles a medida",
    "restauración de muebles",
    "carpintería Illescas",
    "carpintería Toledo",
    "La Sagra",
    "madera",
  ],
  authors: [{ name: "Taller Sagra" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Taller Sagra",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

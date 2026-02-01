import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flamingodevs.com"),
  title: "Crea Tu Tienda Online | Flamingo Devs Venezuela",
  description: "Responde unas preguntas rápidas para ver si podemos ayudarte a crear tu tienda online profesional. Servicio especializado para emprendedores en Venezuela.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Crea Tu Tienda Online | Flamingo Devs Venezuela",
    description: "Servicio especializado para emprendedores en Venezuela",
    url: "https://flamingodevs.com/leads-venezuela",
    siteName: "Flamingo Devs",
    locale: "es_VE",
    type: "website",
  },
};

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans bg-[#0a0a0a] text-white min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}

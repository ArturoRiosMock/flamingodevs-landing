import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const GA_MEASUREMENT_ID = "G-R63EL9BGJ3";

export const metadata: Metadata = {
  metadataBase: new URL("https://flamingodevs.com"),
  title: "Crea Tu Tienda Online | Flamingo Devs Venezuela",
  description: "Responde unas preguntas rápidas para ver si podemos ayudarte a crear tu tienda online profesional. Servicio especializado para emprendedores en Venezuela.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
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
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans bg-[#0a0a0a] text-white min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}

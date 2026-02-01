import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import ChatBot from "@/components/ChatBot";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import CursorWrapper from "@/components/CursorWrapper"; // Optional: Enable for custom cursor effect
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const BASE_URL = "https://flamingodevs.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const metadata = messages.metadata as { title: string; description: string; keywords: string };

  return {
    metadataBase: new URL(BASE_URL),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    authors: [{ name: "Christian Rios", url: BASE_URL }],
    creator: "Christian Rios",
    publisher: "Flamingo Devs",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        "en": `${BASE_URL}/en`,
        "es": `${BASE_URL}/es`,
        "pt": `${BASE_URL}/pt`,
        "x-default": `${BASE_URL}/es`,
      },
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${BASE_URL}/${locale}`,
      siteName: "Flamingo Devs",
      locale: locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Flamingo Devs - Web Development & AI Automation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [`${BASE_URL}/og-image.png`],
      creator: "@flamingodevs",
    },
    verification: {
      google: "your-google-verification-code",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <StructuredData locale={locale} />
        <NextIntlClientProvider messages={messages}>
          {/* <CursorWrapper /> */}
          <Header />
          {children}
          <Footer />
          <ChatBot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

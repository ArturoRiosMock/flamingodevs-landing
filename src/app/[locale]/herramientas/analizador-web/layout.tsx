import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://flamingodevs.com";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.analyzer" });

  const title = t("metadata.title");
  const description = t("metadata.description");

  return {
    title,
    description,
    keywords: t("metadata.keywords"),
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/herramientas/analizador-web`,
      siteName: "Flamingo Devs",
      locale: locale === "es" ? "es_ES" : locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/herramientas/analizador-web`,
      languages: {
        en: `${BASE_URL}/en/herramientas/analizador-web`,
        es: `${BASE_URL}/es/herramientas/analizador-web`,
        pt: `${BASE_URL}/pt/herramientas/analizador-web`,
      },
    },
  };
}

export default function WebAnalyzerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

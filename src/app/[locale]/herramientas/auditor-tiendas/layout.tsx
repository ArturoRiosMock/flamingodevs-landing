import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.storeAudit.metadata" });

  const baseUrl = "https://flamingodevs.com";

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: `${baseUrl}/${locale}/herramientas/auditor-tiendas`,
      languages: {
        en: `${baseUrl}/en/herramientas/auditor-tiendas`,
        es: `${baseUrl}/es/herramientas/auditor-tiendas`,
        pt: `${baseUrl}/pt/herramientas/auditor-tiendas`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/herramientas/auditor-tiendas`,
      siteName: "Flamingo Devs",
      locale: locale === "es" ? "es_ES" : locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default function StoreAuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

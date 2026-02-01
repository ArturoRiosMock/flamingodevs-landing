interface StructuredDataProps {
  locale: string;
}

export default function StructuredData({ locale }: StructuredDataProps) {
  const baseUrl = "https://flamingodevs.com";

  // Localized job titles
  const jobTitles: Record<string, string> = {
    en: "AI Consultant & Full Stack Developer",
    es: "Consultor de IA y Desarrollador Full Stack",
    pt: "Consultor de IA e Desenvolvedor Full Stack",
  };

  // Localized descriptions
  const descriptions: Record<string, string> = {
    en: "Professional web development, Shopify online stores, and AI automation solutions. WordPress, Next.js, and e-commerce specialist.",
    es: "Desarrollo web profesional, tiendas online Shopify y automatización con IA. Especialista en WordPress, Next.js y e-commerce.",
    pt: "Desenvolvimento web profissional, lojas online Shopify e automação com IA. Especialista em WordPress, Next.js e e-commerce.",
  };

  // Person schema (Freelancer profile)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "Christian Rios",
    alternateName: "Christian Arturo Rios Mock",
    jobTitle: jobTitles[locale] || jobTitles.en,
    description: descriptions[locale] || descriptions.en,
    url: baseUrl,
    image: `${baseUrl}/christian-rios.png`,
    sameAs: [
      "https://github.com/ArturoRiosMock",
      "https://www.linkedin.com/in/christian-mock-a5349515b/",
      "https://www.workana.com/freelancer/ba7ac8f9ffb8d2bc4f2d708dd5c2e897",
    ],
    knowsAbout: [
      "Web Development",
      "Shopify Development",
      "WordPress Development",
      "Next.js",
      "React",
      "Node.js",
      "Artificial Intelligence",
      "AI Automation",
      "E-commerce",
      "Full Stack Development",
    ],
    worksFor: {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Flamingo Devs",
    },
  };

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Flamingo Devs",
    url: baseUrl,
    logo: `${baseUrl}/og-image.png`,
    description: descriptions[locale] || descriptions.en,
    founder: {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      name: "Christian Rios",
    },
    sameAs: [
      "https://github.com/ArturoRiosMock",
      "https://www.linkedin.com/in/christian-mock-a5349515b/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-48-9806-8513",
      contactType: "customer service",
      email: "info@flamingodevs.com",
      availableLanguage: ["English", "Spanish", "Portuguese"],
    },
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Flamingo Devs",
    description: descriptions[locale] || descriptions.en,
    publisher: {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Spanish", alternateName: "es" },
      { "@type": "Language", name: "Portuguese", alternateName: "pt" },
    ],
  };

  // Service schemas
  const services = [
    {
      name: locale === "es" ? "Desarrollo Shopify" : locale === "pt" ? "Desenvolvimento Shopify" : "Shopify Development",
      description: locale === "es" 
        ? "Tiendas online Shopify personalizadas optimizadas para conversión" 
        : locale === "pt" 
        ? "Lojas online Shopify personalizadas otimizadas para conversão"
        : "Custom Shopify online stores optimized for conversion",
      serviceType: "Shopify Development",
    },
    {
      name: locale === "es" ? "Desarrollo WordPress" : locale === "pt" ? "Desenvolvimento WordPress" : "WordPress Development",
      description: locale === "es"
        ? "Sitios WordPress de alto rendimiento con funcionalidad personalizada"
        : locale === "pt"
        ? "Sites WordPress de alto desempenho com funcionalidade personalizada"
        : "High-performance WordPress sites with custom functionality",
      serviceType: "WordPress Development",
    },
    {
      name: locale === "es" ? "Automatización con IA" : locale === "pt" ? "Automação com IA" : "AI Automation",
      description: locale === "es"
        ? "Soluciones de automatización inteligente potenciadas por inteligencia artificial"
        : locale === "pt"
        ? "Soluções de automação inteligente potencializadas por inteligência artificial"
        : "Intelligent automation solutions powered by artificial intelligence",
      serviceType: "AI Consulting",
    },
    {
      name: locale === "es" ? "Desarrollo Next.js" : locale === "pt" ? "Desenvolvimento Next.js" : "Next.js Development",
      description: locale === "es"
        ? "Aplicaciones web modernas y escalables con React y Next.js"
        : locale === "pt"
        ? "Aplicações web modernas e escaláveis com React e Next.js"
        : "Modern, scalable web applications with React and Next.js",
      serviceType: "Web Development",
    },
  ];

  const serviceSchemas = services.map((service, index) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/#service-${index}`,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.name,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
          },
        },
      ],
    },
  }));

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/${locale}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {serviceSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

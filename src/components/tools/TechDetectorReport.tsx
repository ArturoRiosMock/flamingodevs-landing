"use client";

import type { TechDetectorResult, TechCategory } from "@/types/tech-detector";
import { categoryInfo } from "@/types/tech-detector";
import TechCard from "./TechCard";
import Link from "next/link";
import { useLocale } from "next-intl";

interface TechDetectorReportProps {
  result: TechDetectorResult;
}

// Group technologies by category
function groupByCategory(technologies: TechDetectorResult["technologies"]) {
  const groups: Record<TechCategory, TechDetectorResult["technologies"]> = {
    cms: [],
    framework: [],
    javascript: [],
    css: [],
    analytics: [],
    marketing: [],
    ecommerce: [],
    hosting: [],
    cdn: [],
    fonts: [],
    security: [],
    payment: [],
    chat: [],
    other: [],
  };

  for (const tech of technologies) {
    groups[tech.category].push(tech);
  }

  return groups;
}

// Generate report text for download
function generateReportText(result: TechDetectorResult): string {
  const date = new Date(result.fetchTime).toLocaleString("es-ES", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  let report = `
═══════════════════════════════════════════════════════════════════════
                  DETECTOR DE TECNOLOGÍAS WEB
                         Flamingo Devs
═══════════════════════════════════════════════════════════════════════

URL Analizada: ${result.finalUrl}
Título: ${result.title || "N/A"}
Fecha del análisis: ${date}
Tiempo de respuesta: ${result.responseTime}ms

───────────────────────────────────────────────────────────────────────
                    TECNOLOGÍAS DETECTADAS
───────────────────────────────────────────────────────────────────────

Total: ${result.technologies.length} tecnologías encontradas

`;

  const groups = groupByCategory(result.technologies);
  const categoryOrder: TechCategory[] = [
    "cms",
    "ecommerce",
    "framework",
    "javascript",
    "css",
    "analytics",
    "marketing",
    "chat",
    "hosting",
    "cdn",
    "fonts",
    "security",
    "payment",
    "other",
  ];

  for (const category of categoryOrder) {
    const techs = groups[category];
    if (techs.length === 0) continue;

    const info = categoryInfo[category];
    report += `\n${info.label.toUpperCase()} (${techs.length}):\n`;
    report += "─".repeat(40) + "\n";

    for (const tech of techs) {
      const confidence =
        tech.confidence === "high"
          ? "★★★"
          : tech.confidence === "medium"
          ? "★★☆"
          : "★☆☆";
      report += `  • ${tech.name} ${confidence}\n`;
      if (tech.description) {
        report += `    ${tech.description}\n`;
      }
      if (tech.website) {
        report += `    ${tech.website}\n`;
      }
      report += "\n";
    }
  }

  if (result.meta.generator) {
    report += `
───────────────────────────────────────────────────────────────────────
                      META INFORMACIÓN
───────────────────────────────────────────────────────────────────────

Generator: ${result.meta.generator}
`;
  }

  if (result.meta.description) {
    report += `Descripción: ${result.meta.description}\n`;
  }

  report += `
═══════════════════════════════════════════════════════════════════════
                    ¿NECESITAS AYUDA?
═══════════════════════════════════════════════════════════════════════

Puedo ayudarte a construir o mejorar tu sitio web usando las mejores
tecnologías. Especialista en Shopify, WordPress y desarrollo web.

🌐 Web: https://flamingodevs.com
📧 Contacto: https://flamingodevs.com/es#contact

═══════════════════════════════════════════════════════════════════════
       Reporte generado por Flamingo Devs Tech Detector
═══════════════════════════════════════════════════════════════════════
`;

  return report;
}

export default function TechDetectorReport({ result }: TechDetectorReportProps) {
  const locale = useLocale();
  const analysisDate = new Date(result.fetchTime).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const groups = groupByCategory(result.technologies);
  const categoryOrder: TechCategory[] = [
    "cms",
    "ecommerce",
    "framework",
    "javascript",
    "css",
    "analytics",
    "marketing",
    "chat",
    "hosting",
    "cdn",
    "fonts",
    "security",
    "payment",
    "other",
  ];

  const handleDownloadReport = () => {
    const reportText = generateReportText(result);
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const domain = new URL(result.finalUrl).hostname.replace(/\./g, "-");
    a.download = `tecnologias-${domain}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header with URL info */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted mb-1">Resultados para:</p>
            <a
              href={result.finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-accent hover:underline break-all"
            >
              {result.finalUrl}
            </a>
            {result.title && (
              <p className="text-sm text-muted mt-1 line-clamp-1">{result.title}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted">
              <span className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {result.responseTime}ms
              </span>
              <span>|</span>
              <span>{analysisDate}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {result.technologies.length}
              </p>
              <p className="text-sm text-muted">tecnologías detectadas</p>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-background rounded-lg hover:bg-accent/90 transition-all"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Descargar reporte
            </button>
          </div>
        </div>
      </div>

      {/* Technologies by Category */}
      {result.technologies.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <svg
            className="h-12 w-12 mx-auto text-muted mb-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se detectaron tecnologías
          </h3>
          <p className="text-muted">
            No pudimos identificar tecnologías en este sitio. Puede que use tecnologías
            personalizadas o que el contenido esté protegido.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categoryOrder.map((category) => {
            const techs = groups[category];
            if (techs.length === 0) return null;

            const info = categoryInfo[category];

            return (
              <div
                key={category}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-accent">{info.label}</span>
                  <span className="text-sm font-normal text-muted">
                    ({techs.length})
                  </span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {techs.map((tech) => (
                    <TechCard key={tech.name} tech={tech} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent rounded-2xl border border-accent/20 p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          ¿Quieres construir algo similar?
        </h3>
        <p className="text-muted mb-6 max-w-2xl mx-auto">
          Puedo ayudarte a elegir las mejores tecnologías para tu proyecto y
          construir tu web o tienda online desde cero.
        </p>
        <Link
          href={`/${locale}#contact`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-all hover:scale-[1.02]"
        >
          Solicitar consultoría gratuita
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

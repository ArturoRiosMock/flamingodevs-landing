"use client";

import type { AnalysisResult } from "@/types/pagespeed";
import ScoreCard from "./ScoreCard";
import CoreWebVitals from "./CoreWebVitals";
import OpportunitiesList from "./OpportunitiesList";
import Link from "next/link";
import { useLocale } from "next-intl";

interface AnalysisReportProps {
  result: AnalysisResult;
}

// Generate recommendations based on scores and opportunities
function generateRecommendations(result: AnalysisResult): { priority: "high" | "medium" | "low"; title: string; description: string }[] {
  const recommendations: { priority: "high" | "medium" | "low"; title: string; description: string }[] = [];

  // Performance recommendations
  if (result.scores.performance && result.scores.performance.score < 50) {
    recommendations.push({
      priority: "high",
      title: "Optimizar rendimiento urgentemente",
      description: "Tu sitio tiene un rendimiento crítico. Considera comprimir imágenes, minificar CSS/JS, y usar lazy loading para mejorar los tiempos de carga.",
    });
  } else if (result.scores.performance && result.scores.performance.score < 90) {
    recommendations.push({
      priority: "medium",
      title: "Mejorar velocidad de carga",
      description: "Optimiza las imágenes con formatos modernos (WebP), implementa caché del navegador y considera usar un CDN para servir contenido estático.",
    });
  }

  // Accessibility recommendations
  if (result.scores.accessibility && result.scores.accessibility.score < 70) {
    recommendations.push({
      priority: "high",
      title: "Mejorar accesibilidad",
      description: "Asegúrate de que todas las imágenes tengan texto alternativo, que los colores tengan suficiente contraste y que la navegación sea accesible por teclado.",
    });
  }

  // SEO recommendations
  if (result.scores.seo && result.scores.seo.score < 80) {
    recommendations.push({
      priority: "medium",
      title: "Optimizar SEO",
      description: "Verifica que todas las páginas tengan meta títulos y descripciones únicos, usa encabezados jerárquicos (H1, H2, H3) y añade datos estructurados.",
    });
  }

  // Best practices recommendations
  if (result.scores.bestPractices && result.scores.bestPractices.score < 80) {
    recommendations.push({
      priority: "medium",
      title: "Implementar buenas prácticas",
      description: "Asegúrate de usar HTTPS, evita errores en la consola del navegador y actualiza las librerías con vulnerabilidades conocidas.",
    });
  }

  // Core Web Vitals specific recommendations
  const lcp = result.coreWebVitals.find(v => v.id === "largest-contentful-paint");
  if (lcp && lcp.category === "poor") {
    recommendations.push({
      priority: "high",
      title: "Reducir LCP (Largest Contentful Paint)",
      description: "El contenido principal tarda demasiado en cargar. Optimiza la imagen principal, usa preload para recursos críticos y mejora el tiempo de respuesta del servidor.",
    });
  }

  const cls = result.coreWebVitals.find(v => v.id === "cumulative-layout-shift");
  if (cls && cls.category === "poor") {
    recommendations.push({
      priority: "high",
      title: "Reducir CLS (Cumulative Layout Shift)",
      description: "Tu página tiene cambios de diseño inesperados. Define dimensiones para imágenes y videos, evita insertar contenido dinámico arriba del contenido existente.",
    });
  }

  const tbt = result.coreWebVitals.find(v => v.id === "total-blocking-time");
  if (tbt && tbt.category === "poor") {
    recommendations.push({
      priority: "high",
      title: "Reducir TBT (Total Blocking Time)",
      description: "El hilo principal está bloqueado demasiado tiempo. Divide el JavaScript en chunks más pequeños, usa web workers para tareas pesadas y elimina código no utilizado.",
    });
  }

  // Add general recommendations based on opportunities
  if (result.opportunities.some(o => o.id === "render-blocking-resources")) {
    recommendations.push({
      priority: "medium",
      title: "Eliminar recursos que bloquean el renderizado",
      description: "Carga CSS y JavaScript de forma asíncrona o diferida. Considera inline el CSS crítico para el above-the-fold.",
    });
  }

  if (result.opportunities.some(o => o.id === "unused-javascript" || o.id === "unused-css-rules")) {
    recommendations.push({
      priority: "low",
      title: "Eliminar código no utilizado",
      description: "Hay CSS y/o JavaScript que no se utiliza en esta página. Usa tree-shaking y divide el código por rutas para cargar solo lo necesario.",
    });
  }

  if (result.opportunities.some(o => o.id === "modern-image-formats" || o.id === "uses-optimized-images")) {
    recommendations.push({
      priority: "medium",
      title: "Optimizar imágenes",
      description: "Convierte las imágenes a formatos modernos como WebP o AVIF, comprime sin perder calidad visible y usa srcset para servir tamaños apropiados.",
    });
  }

  return recommendations;
}

// Generate report content for download
function generateReportText(result: AnalysisResult, recommendations: { priority: string; title: string; description: string }[]): string {
  const date = new Date(result.fetchTime).toLocaleString("es-ES", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  let report = `
═══════════════════════════════════════════════════════════════════════
                    REPORTE DE RENDIMIENTO WEB
                         Flamingo Devs
═══════════════════════════════════════════════════════════════════════

URL Analizada: ${result.finalUrl}
Estrategia: ${result.strategy === "mobile" ? "Móvil" : "Escritorio"}
Fecha del análisis: ${date}

───────────────────────────────────────────────────────────────────────
                         PUNTUACIONES
───────────────────────────────────────────────────────────────────────

`;

  if (result.scores.performance) {
    report += `  Rendimiento:      ${result.scores.performance.score}/100 ${getScoreEmoji(result.scores.performance.score)}\n`;
  }
  if (result.scores.accessibility) {
    report += `  Accesibilidad:    ${result.scores.accessibility.score}/100 ${getScoreEmoji(result.scores.accessibility.score)}\n`;
  }
  if (result.scores.bestPractices) {
    report += `  Buenas Prácticas: ${result.scores.bestPractices.score}/100 ${getScoreEmoji(result.scores.bestPractices.score)}\n`;
  }
  if (result.scores.seo) {
    report += `  SEO:              ${result.scores.seo.score}/100 ${getScoreEmoji(result.scores.seo.score)}\n`;
  }

  report += `
───────────────────────────────────────────────────────────────────────
                      CORE WEB VITALS
───────────────────────────────────────────────────────────────────────

`;

  for (const vital of result.coreWebVitals) {
    const status = vital.category === "good" ? "BUENO" : vital.category === "needs-improvement" ? "MEJORABLE" : "POBRE";
    report += `  ${vital.name}: ${vital.value} [${status}]\n`;
  }

  if (result.opportunities.length > 0) {
    report += `
───────────────────────────────────────────────────────────────────────
                   OPORTUNIDADES DE MEJORA
───────────────────────────────────────────────────────────────────────

`;
    for (const opp of result.opportunities.slice(0, 10)) {
      report += `  • ${opp.title}\n`;
      if (opp.displayValue) {
        report += `    Valor: ${opp.displayValue}\n`;
      }
      if (opp.savings) {
        report += `    Ahorro potencial: ${opp.savings}\n`;
      }
      report += `\n`;
    }
  }

  report += `
───────────────────────────────────────────────────────────────────────
                      RECOMENDACIONES
───────────────────────────────────────────────────────────────────────

`;

  const highPriority = recommendations.filter(r => r.priority === "high");
  const mediumPriority = recommendations.filter(r => r.priority === "medium");
  const lowPriority = recommendations.filter(r => r.priority === "low");

  if (highPriority.length > 0) {
    report += `PRIORIDAD ALTA:\n\n`;
    for (const rec of highPriority) {
      report += `  ⚠️ ${rec.title}\n`;
      report += `     ${rec.description}\n\n`;
    }
  }

  if (mediumPriority.length > 0) {
    report += `PRIORIDAD MEDIA:\n\n`;
    for (const rec of mediumPriority) {
      report += `  📌 ${rec.title}\n`;
      report += `     ${rec.description}\n\n`;
    }
  }

  if (lowPriority.length > 0) {
    report += `PRIORIDAD BAJA:\n\n`;
    for (const rec of lowPriority) {
      report += `  💡 ${rec.title}\n`;
      report += `     ${rec.description}\n\n`;
    }
  }

  report += `
═══════════════════════════════════════════════════════════════════════
                    ¿NECESITAS AYUDA?
═══════════════════════════════════════════════════════════════════════

Puedo ayudarte a implementar estas mejoras y optimizar tu sitio web
o tienda online. Especialista en Shopify, WordPress y desarrollo web.

🌐 Web: https://flamingodevs.com
📧 Contacto: https://flamingodevs.com/es#contact

═══════════════════════════════════════════════════════════════════════
         Reporte generado por Flamingo Devs Web Analyzer
═══════════════════════════════════════════════════════════════════════
`;

  return report;
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return "[EXCELENTE]";
  if (score >= 50) return "[MEJORABLE]";
  return "[CRÍTICO]";
}

function getPriorityColor(priority: "high" | "medium" | "low"): string {
  switch (priority) {
    case "high": return "bg-red-500";
    case "medium": return "bg-orange-500";
    case "low": return "bg-blue-500";
  }
}

function getPriorityLabel(priority: "high" | "medium" | "low"): string {
  switch (priority) {
    case "high": return "Alta";
    case "medium": return "Media";
    case "low": return "Baja";
  }
}

export default function AnalysisReport({ result }: AnalysisReportProps) {
  const locale = useLocale();
  const analysisDate = new Date(result.fetchTime).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const recommendations = generateRecommendations(result);

  const handleDownloadReport = () => {
    const reportText = generateReportText(result, recommendations);
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const domain = new URL(result.finalUrl).hostname.replace(/\./g, "-");
    a.download = `reporte-${domain}-${result.strategy}-${new Date().toISOString().split("T")[0]}.txt`;
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
            <div className="flex items-center gap-4 mt-2 text-sm text-muted">
              <span className="flex items-center gap-1">
                {result.strategy === "mobile" ? (
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
                      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                    />
                  </svg>
                ) : (
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
                      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                    />
                  </svg>
                )}
                {result.strategy === "mobile" ? "Móvil" : "Escritorio"}
              </span>
              <span>|</span>
              <span>{analysisDate}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-sm text-muted">
                {result.passedAudits} de {result.totalAudits} auditorías pasadas
              </p>
              <div className="mt-1 w-32 h-2 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${(result.passedAudits / result.totalAudits) * 100}%`,
                  }}
                />
              </div>
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

      {/* Score Cards */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
          Puntuaciones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {result.scores.performance && (
            <ScoreCard
              score={result.scores.performance.score}
              title="Rendimiento"
            />
          )}
          {result.scores.accessibility && (
            <ScoreCard
              score={result.scores.accessibility.score}
              title="Accesibilidad"
            />
          )}
          {result.scores.bestPractices && (
            <ScoreCard
              score={result.scores.bestPractices.score}
              title="Buenas Prácticas"
            />
          )}
          {result.scores.seo && (
            <ScoreCard score={result.scores.seo.score} title="SEO" />
          )}
        </div>
      </div>

      {/* Core Web Vitals */}
      <CoreWebVitals vitals={result.coreWebVitals} />

      {/* Opportunities */}
      <OpportunitiesList
        opportunities={result.opportunities}
        title="Oportunidades de mejora"
        emptyMessage="Tu sitio está bien optimizado. No se encontraron oportunidades de mejora significativas."
      />

      {/* Diagnostics */}
      {result.diagnostics.length > 0 && (
        <OpportunitiesList
          opportunities={result.diagnostics}
          title="Diagnósticos adicionales"
          emptyMessage="No hay diagnósticos adicionales."
        />
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            Recomendaciones
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-background rounded-xl border border-border"
              >
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold ${getPriorityColor(rec.priority)}`}
                  >
                    {rec.priority === "high" ? "!" : rec.priority === "medium" ? "•" : "○"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{rec.title}</h4>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full text-white ${getPriorityColor(rec.priority)}`}
                    >
                      Prioridad {getPriorityLabel(rec.priority)}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent rounded-2xl border border-accent/20 p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          ¿Necesitas ayuda para optimizar tu sitio?
        </h3>
        <p className="text-muted mb-6 max-w-2xl mx-auto">
          Puedo ayudarte a mejorar el rendimiento de tu web o tienda online.
          Especialista en Shopify, WordPress y desarrollo web moderno.
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

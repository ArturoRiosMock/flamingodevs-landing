"use client";

import type { StoreAuditResult } from "@/types/store-audit";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/types/store-audit";
import AuditScoreCircle from "./AuditScoreCircle";
import AuditCategoryCard from "./AuditCategoryCard";
import Link from "next/link";
import { useLocale } from "next-intl";

interface StoreAuditReportProps {
  result: StoreAuditResult;
}

const platformNames: Record<string, string> = {
  shopify: "Shopify",
  woocommerce: "WooCommerce",
  magento: "Magento",
  prestashop: "PrestaShop",
  tiendanube: "Tiendanube",
  vtex: "VTEX",
  custom: "E-commerce Personalizado",
  unknown: "No identificada",
};

function generateReportText(result: StoreAuditResult): string {
  const date = new Date(result.fetchTime).toLocaleString("es-ES", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  let report = `
═══════════════════════════════════════════════════════════════════════
                    AUDITORÍA DE TIENDA ONLINE
                         Flamingo Devs
═══════════════════════════════════════════════════════════════════════

INFORMACIÓN DE LA TIENDA
────────────────────────────────────────────────────────────────────────
URL: ${result.finalUrl}
${result.storeName ? `Nombre: ${result.storeName}` : ""}
Plataforma: ${platformNames[result.platform]}
Fecha del análisis: ${date}

═══════════════════════════════════════════════════════════════════════
                       PUNTUACIÓN GLOBAL: ${result.globalScore}/100
                            ${getScoreLabel(result.globalScore)}
═══════════════════════════════════════════════════════════════════════

RESUMEN
────────────────────────────────────────────────────────────────────────
✓ Tests aprobados: ${result.summary.passed}
✗ Tests fallidos: ${result.summary.failed}
⚠ Advertencias: ${result.summary.warnings}
Total de tests: ${result.summary.total}

`;

  // Category scores
  report += `
PUNTUACIÓN POR CATEGORÍA
────────────────────────────────────────────────────────────────────────
`;

  for (const cat of result.categories) {
    const bar = "█".repeat(Math.round(cat.score / 10)) + "░".repeat(10 - Math.round(cat.score / 10));
    report += `${cat.name.padEnd(30)} ${bar} ${cat.score}/100\n`;
  }

  // Critical issues
  if (result.criticalIssues.length > 0) {
    report += `
═══════════════════════════════════════════════════════════════════════
                      PROBLEMAS CRÍTICOS
═══════════════════════════════════════════════════════════════════════

`;
    for (const issue of result.criticalIssues) {
      report += `⚠️ ${issue.name}\n`;
      report += `   ${issue.description}\n`;
      if (issue.recommendation) {
        report += `   → ${issue.recommendation}\n`;
      }
      report += "\n";
    }
  }

  // Top recommendations
  if (result.topRecommendations.length > 0) {
    report += `
═══════════════════════════════════════════════════════════════════════
                   TOP 5 RECOMENDACIONES
═══════════════════════════════════════════════════════════════════════

`;
    result.topRecommendations.forEach((rec, i) => {
      report += `${i + 1}. ${rec}\n\n`;
    });
  }

  // Detailed results
  report += `
═══════════════════════════════════════════════════════════════════════
                      DETALLE POR CATEGORÍA
═══════════════════════════════════════════════════════════════════════
`;

  for (const cat of result.categories) {
    report += `\n${cat.name.toUpperCase()} (${cat.score}/100)\n`;
    report += "─".repeat(50) + "\n";
    
    for (const test of cat.tests) {
      const status = test.status === "pass" ? "✓" : test.status === "fail" ? "✗" : "⚠";
      report += `${status} ${test.name}\n`;
      if (test.details) {
        report += `  ${test.details}\n`;
      }
      if (test.status === "fail" && test.recommendation) {
        report += `  → ${test.recommendation}\n`;
      }
    }
  }

  report += `
═══════════════════════════════════════════════════════════════════════
                    ¿NECESITAS AYUDA PROFESIONAL?
═══════════════════════════════════════════════════════════════════════

Puedo ayudarte a solucionar estos problemas y aumentar las ventas
de tu tienda online. Especialista en Shopify, WooCommerce y e-commerce.

🌐 Web: https://flamingodevs.com
📧 Contacto: https://flamingodevs.com/es#contact

¡Agenda una consulta gratuita y revisamos tu tienda juntos!

═══════════════════════════════════════════════════════════════════════
          Reporte generado por Flamingo Devs Store Audit
═══════════════════════════════════════════════════════════════════════
`;

  return report;
}

export default function StoreAuditReport({ result }: StoreAuditReportProps) {
  const locale = useLocale();
  const analysisDate = new Date(result.fetchTime).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleDownloadReport = () => {
    const reportText = generateReportText(result);
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const domain = new URL(result.finalUrl).hostname.replace(/\./g, "-");
    a.download = `auditoria-${domain}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header with store info and global score */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Store Info */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm text-muted mb-1">Resultados para:</p>
            <a
              href={result.finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-accent hover:underline break-all"
            >
              {result.storeName || result.finalUrl}
            </a>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/20 rounded-full text-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
                {platformNames[result.platform]}
              </span>
              <span className="text-sm text-muted">{analysisDate}</span>
            </div>
          </div>
          
          {/* Global Score */}
          <div className="flex flex-col items-center">
            <AuditScoreCircle score={result.globalScore} size="lg" />
          </div>
          
          {/* Download Button */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Descargar Reporte
            </button>
            <p className="text-xs text-muted text-center">Archivo .txt con todos los detalles</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-3xl font-bold text-green-500">{result.summary.passed}</p>
          <p className="text-sm text-muted">Tests Aprobados</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{result.summary.failed}</p>
          <p className="text-sm text-muted">Tests Fallidos</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">{result.summary.warnings}</p>
          <p className="text-sm text-muted">Advertencias</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{result.summary.total}</p>
          <p className="text-sm text-muted">Total Tests</p>
        </div>
      </div>

      {/* Critical Issues */}
      {result.criticalIssues.length > 0 && (
        <div className="bg-red-500/10 rounded-2xl border border-red-500/20 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Problemas Críticos
          </h2>
          <div className="space-y-4">
            {result.criticalIssues.map((issue) => (
              <div key={issue.id} className="bg-background rounded-xl p-4">
                <h3 className="font-semibold text-foreground">{issue.name}</h3>
                <p className="text-sm text-muted mt-1">{issue.description}</p>
                {issue.recommendation && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    <span className="font-medium">Solución:</span> {issue.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Recommendations */}
      {result.topRecommendations.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            Top 5 Recomendaciones para Aumentar Ventas
          </h2>
          <ol className="space-y-3">
            {result.topRecommendations.map((rec, index) => (
              <li key={index} className="flex gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${getScoreBgColor(100 - index * 20)}`}>
                  {index + 1}
                </span>
                <p className="text-foreground">{rec}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Category Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          Detalle por Categoría
        </h2>
        <div className="space-y-4">
          {result.categories.map((category) => (
            <AuditCategoryCard key={category.category} category={category} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent rounded-2xl border border-accent/20 p-8 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          ¿Tu tienda necesita ayuda profesional?
        </h3>
        <p className="text-muted mb-6 max-w-2xl mx-auto">
          Puedo ayudarte a solucionar estos problemas y aumentar las conversiones de tu tienda.
          Especialista en Shopify, WooCommerce y optimización de e-commerce.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}#contact`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-all hover:scale-[1.02]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            Solicitar Auditoría Completa GRATIS
          </Link>
          <a
            href="https://wa.me/584242066696?text=Hola!%20Vi%20el%20auditor%20de%20tiendas%20y%20me%20gustaría%20optimizar%20mi%20tienda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all hover:scale-[1.02]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

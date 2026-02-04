"use client";

import type { CoreWebVital } from "@/types/pagespeed";

interface CoreWebVitalsProps {
  vitals: CoreWebVital[];
}

function getCategoryColor(category: "good" | "needs-improvement" | "poor"): string {
  switch (category) {
    case "good":
      return "bg-green-500";
    case "needs-improvement":
      return "bg-orange-500";
    case "poor":
      return "bg-red-500";
  }
}

function getCategoryBorderColor(category: "good" | "needs-improvement" | "poor"): string {
  switch (category) {
    case "good":
      return "border-green-500/30";
    case "needs-improvement":
      return "border-orange-500/30";
    case "poor":
      return "border-red-500/30";
  }
}

function getCategoryLabel(category: "good" | "needs-improvement" | "poor"): string {
  switch (category) {
    case "good":
      return "Bueno";
    case "needs-improvement":
      return "Mejorable";
    case "poor":
      return "Pobre";
  }
}

// Map audit IDs to friendly short names
const vitalNames: Record<string, string> = {
  "largest-contentful-paint": "LCP",
  "cumulative-layout-shift": "CLS",
  "total-blocking-time": "TBT",
  "first-contentful-paint": "FCP",
  "speed-index": "SI",
  "interactive": "TTI",
};

const vitalDescriptions: Record<string, string> = {
  "largest-contentful-paint": "Largest Contentful Paint - Tiempo de carga del contenido más grande",
  "cumulative-layout-shift": "Cumulative Layout Shift - Estabilidad visual de la página",
  "total-blocking-time": "Total Blocking Time - Tiempo que el hilo principal está bloqueado",
  "first-contentful-paint": "First Contentful Paint - Primer contenido visible",
  "speed-index": "Speed Index - Velocidad de llenado del contenido visible",
  "interactive": "Time to Interactive - Tiempo hasta que la página es interactiva",
};

export default function CoreWebVitals({ vitals }: CoreWebVitalsProps) {
  if (vitals.length === 0) {
    return null;
  }

  return (
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
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
          />
        </svg>
        Core Web Vitals
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className={`relative p-4 rounded-xl border-2 ${getCategoryBorderColor(vital.category)} bg-background/50 hover:bg-background transition-colors group`}
          >
            {/* Category indicator */}
            <div
              className={`absolute top-2 right-2 w-2 h-2 rounded-full ${getCategoryColor(vital.category)}`}
              title={getCategoryLabel(vital.category)}
            />

            <div className="text-center">
              <span className="text-xs font-medium text-muted uppercase tracking-wider">
                {vitalNames[vital.id] || vital.id}
              </span>
              <p className="mt-1 text-xl font-bold text-foreground">
                {vital.value}
              </p>
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(vital.category)} text-white`}
              >
                {getCategoryLabel(vital.category)}
              </span>
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {vitalDescriptions[vital.id] || vital.name}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

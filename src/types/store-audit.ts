// Store Audit Types

export type AuditCategory =
  | "trust"
  | "checkout"
  | "shipping"
  | "performance"
  | "products"
  | "descriptions"
  | "search"
  | "urgency"
  | "upselling"
  | "seo";

export type TestStatus = "pass" | "fail" | "warning" | "info";

export type Platform = 
  | "shopify"
  | "woocommerce"
  | "magento"
  | "prestashop"
  | "tiendanube"
  | "vtex"
  | "custom"
  | "unknown";

export interface AuditTest {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  score: number; // 0-100
  weight: number; // importance weight for category score
  details?: string;
  recommendation?: string;
}

export interface CategoryScore {
  category: AuditCategory;
  name: string;
  description: string;
  score: number; // 0-100
  tests: AuditTest[];
  icon: string;
}

export interface StoreAuditResult {
  url: string;
  finalUrl: string;
  storeName?: string;
  platform: Platform;
  platformConfidence: "high" | "medium" | "low";
  globalScore: number;
  categories: CategoryScore[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    total: number;
  };
  criticalIssues: AuditTest[];
  topRecommendations: string[];
  fetchTime: string;
  analysisTime: number;
}

export interface StoreAuditError {
  error: true;
  code: string;
  message: string;
}

// Category metadata
export const categoryMeta: Record<AuditCategory, { name: string; description: string; icon: string }> = {
  trust: {
    name: "Confianza y Seguridad",
    description: "Elementos que generan confianza en los visitantes",
    icon: "shield",
  },
  checkout: {
    name: "Checkout y Conversión",
    description: "Facilidad para completar una compra",
    icon: "cart",
  },
  shipping: {
    name: "Envío y Costos",
    description: "Transparencia en costos y tiempos de envío",
    icon: "truck",
  },
  performance: {
    name: "Velocidad y Rendimiento",
    description: "Tiempo de carga y experiencia móvil",
    icon: "speed",
  },
  products: {
    name: "Presentación de Productos",
    description: "Calidad de imágenes y presentación visual",
    icon: "image",
  },
  descriptions: {
    name: "Descripciones de Producto",
    description: "Textos persuasivos que venden",
    icon: "text",
  },
  search: {
    name: "Buscador Interno",
    description: "Facilidad para encontrar productos",
    icon: "search",
  },
  urgency: {
    name: "Urgencia y Escasez",
    description: "Elementos que motivan la compra inmediata",
    icon: "clock",
  },
  upselling: {
    name: "Upselling y Cross-selling",
    description: "Estrategias para aumentar el ticket promedio",
    icon: "trending",
  },
  seo: {
    name: "SEO de Producto",
    description: "Optimización para buscadores",
    icon: "globe",
  },
};

// Score thresholds
export function getScoreLevel(score: number): "good" | "warning" | "bad" {
  if (score >= 80) return "good";
  if (score >= 50) return "warning";
  return "bad";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Muy Bueno";
  if (score >= 70) return "Bueno";
  if (score >= 60) return "Aceptable";
  if (score >= 50) return "Mejorable";
  if (score >= 30) return "Deficiente";
  return "Crítico";
}

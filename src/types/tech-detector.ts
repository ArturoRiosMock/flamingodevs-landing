// Technology categories
export type TechCategory =
  | "cms"
  | "framework"
  | "javascript"
  | "css"
  | "analytics"
  | "marketing"
  | "ecommerce"
  | "hosting"
  | "cdn"
  | "fonts"
  | "security"
  | "payment"
  | "chat"
  | "other";

export interface Technology {
  name: string;
  category: TechCategory;
  icon?: string;
  website?: string;
  description?: string;
  confidence: "high" | "medium" | "low";
  version?: string;
}

export interface TechDetectorResult {
  url: string;
  finalUrl: string;
  title?: string;
  favicon?: string;
  technologies: Technology[];
  meta: {
    generator?: string;
    description?: string;
  };
  headers: Record<string, string>;
  fetchTime: string;
  responseTime: number;
}

export interface TechDetectorError {
  error: true;
  code: string;
  message: string;
}

// Technology signatures for detection
export interface TechSignature {
  name: string;
  category: TechCategory;
  website?: string;
  description?: string;
  icon?: string;
  // Detection patterns
  patterns: {
    // HTML patterns
    html?: RegExp[];
    // Script src patterns
    scripts?: RegExp[];
    // Link href patterns (CSS)
    styles?: RegExp[];
    // Meta tag patterns
    meta?: { name?: string; property?: string; content?: RegExp }[];
    // Header patterns
    headers?: { name: string; value?: RegExp }[];
    // Cookie patterns
    cookies?: RegExp[];
    // URL patterns
    url?: RegExp[];
    // Generator meta tag
    generator?: RegExp[];
  };
}

// Category display info
export const categoryInfo: Record<TechCategory, { label: string; icon: string; color: string }> = {
  cms: { label: "CMS", icon: "document", color: "blue" },
  framework: { label: "Framework", icon: "code", color: "purple" },
  javascript: { label: "JavaScript", icon: "javascript", color: "yellow" },
  css: { label: "CSS Framework", icon: "palette", color: "pink" },
  analytics: { label: "Analytics", icon: "chart", color: "green" },
  marketing: { label: "Marketing", icon: "megaphone", color: "orange" },
  ecommerce: { label: "E-commerce", icon: "cart", color: "emerald" },
  hosting: { label: "Hosting", icon: "server", color: "slate" },
  cdn: { label: "CDN", icon: "globe", color: "cyan" },
  fonts: { label: "Fuentes", icon: "type", color: "gray" },
  security: { label: "Seguridad", icon: "shield", color: "red" },
  payment: { label: "Pagos", icon: "credit-card", color: "indigo" },
  chat: { label: "Chat/Soporte", icon: "chat", color: "teal" },
  other: { label: "Otros", icon: "puzzle", color: "gray" },
};

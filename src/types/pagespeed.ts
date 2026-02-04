// Types for PageSpeed Insights API v5 Response

export type Strategy = 'desktop' | 'mobile';

export type ScoreCategory = 'FAST' | 'AVERAGE' | 'SLOW' | 'NONE';

export interface CategoryScore {
  id: string;
  title: string;
  description: string;
  score: number | null;
  manualDescription?: string;
  auditRefs?: AuditRef[];
}

export interface AuditRef {
  id: string;
  weight: number;
  group?: string;
}

export interface AuditDetails {
  type?: string;
  items?: unknown[];
  headings?: unknown[];
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
}

export interface Audit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: 'numeric' | 'binary' | 'manual' | 'informative' | 'not_applicable' | 'error';
  displayValue?: string;
  explanation?: string;
  errorMessage?: string;
  warnings?: string[];
  details?: AuditDetails;
  numericValue?: number;
  numericUnit?: string;
}

export interface MetricDistribution {
  min: number;
  max: number;
  proportion: number;
}

export interface LoadingMetric {
  percentile: number;
  distributions: MetricDistribution[];
  category: ScoreCategory;
}

export interface LoadingExperience {
  id: string;
  metrics: {
    CUMULATIVE_LAYOUT_SHIFT_SCORE?: LoadingMetric;
    EXPERIMENTAL_TIME_TO_FIRST_BYTE?: LoadingMetric;
    FIRST_CONTENTFUL_PAINT_MS?: LoadingMetric;
    FIRST_INPUT_DELAY_MS?: LoadingMetric;
    INTERACTION_TO_NEXT_PAINT?: LoadingMetric;
    LARGEST_CONTENTFUL_PAINT_MS?: LoadingMetric;
  };
  overall_category: ScoreCategory;
  initial_url: string;
}

export interface LighthouseEnvironment {
  networkUserAgent: string;
  hostUserAgent: string;
  benchmarkIndex: number;
}

export interface LighthouseConfigSettings {
  emulatedFormFactor: 'desktop' | 'mobile' | 'none';
  locale: string;
  onlyCategories?: string[];
}

export interface LighthouseRuntimeError {
  code?: string;
  message?: string;
}

export interface LighthouseResult {
  requestedUrl: string;
  finalUrl: string;
  lighthouseVersion: string;
  userAgent: string;
  fetchTime: string;
  environment: LighthouseEnvironment;
  runWarnings: string[];
  configSettings: LighthouseConfigSettings;
  audits: Record<string, Audit>;
  categories: {
    performance?: CategoryScore;
    accessibility?: CategoryScore;
    'best-practices'?: CategoryScore;
    seo?: CategoryScore;
  };
  categoryGroups?: Record<string, { title: string; description: string }>;
  runtimeError?: LighthouseRuntimeError;
  timing: { total: number };
}

export interface PageSpeedResponse {
  captchaResult?: string;
  kind: string;
  id: string;
  loadingExperience?: LoadingExperience;
  originLoadingExperience?: LoadingExperience;
  lighthouseResult: LighthouseResult;
  analysisUTCTimestamp: string;
  version: {
    major: number;
    minor: number;
  };
}

// Normalized types for frontend consumption
export interface ScoreData {
  score: number;
  title: string;
  description: string;
}

export interface CoreWebVital {
  id: string;
  name: string;
  value: string;
  score: number | null;
  description: string;
  category: 'good' | 'needs-improvement' | 'poor';
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  savings?: string;
}

export interface AnalysisResult {
  url: string;
  finalUrl: string;
  strategy: Strategy;
  fetchTime: string;
  scores: {
    performance: ScoreData | null;
    accessibility: ScoreData | null;
    bestPractices: ScoreData | null;
    seo: ScoreData | null;
  };
  coreWebVitals: CoreWebVital[];
  opportunities: Opportunity[];
  diagnostics: Opportunity[];
  passedAudits: number;
  totalAudits: number;
}

export interface AnalysisError {
  error: string;
  code?: string;
  details?: string;
}

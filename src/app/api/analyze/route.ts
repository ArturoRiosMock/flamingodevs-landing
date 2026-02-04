import { NextRequest, NextResponse } from "next/server";
import type {
  PageSpeedResponse,
  AnalysisResult,
  Strategy,
  CoreWebVital,
  Opportunity,
  Audit,
} from "@/types/pagespeed";

const PAGESPEED_API_URL =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

// Core Web Vitals audit IDs
const CORE_WEB_VITALS_IDS = [
  "largest-contentful-paint",
  "cumulative-layout-shift",
  "total-blocking-time", // Proxy for INP in lab data
  "first-contentful-paint",
  "speed-index",
  "interactive",
];

// Opportunity audit IDs (things that can be improved)
const OPPORTUNITY_IDS = [
  "render-blocking-resources",
  "unused-css-rules",
  "unused-javascript",
  "modern-image-formats",
  "offscreen-images",
  "unminified-css",
  "unminified-javascript",
  "efficient-animated-content",
  "duplicated-javascript",
  "legacy-javascript",
  "uses-long-cache-ttl",
  "total-byte-weight",
  "dom-size",
  "uses-responsive-images",
  "uses-optimized-images",
  "uses-text-compression",
  "server-response-time",
  "redirects",
  "mainthread-work-breakdown",
  "bootup-time",
  "font-display",
  "third-party-summary",
];

/**
 * Validates that a string is a valid URL
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL by adding https:// if missing
 */
function normalizeUrl(urlString: string): string {
  let url = urlString.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

/**
 * Checks if URL is allowed (not localhost or internal IPs)
 */
function isAllowedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    // Block localhost and common internal hostnames
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname.endsWith(".local")
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Determines the category (good, needs-improvement, poor) based on score
 */
function getScoreCategory(
  score: number | null
): "good" | "needs-improvement" | "poor" {
  if (score === null) return "poor";
  if (score >= 0.9) return "good";
  if (score >= 0.5) return "needs-improvement";
  return "poor";
}

/**
 * Extracts Core Web Vitals from audits
 */
function extractCoreWebVitals(
  audits: Record<string, Audit>
): CoreWebVital[] {
  const vitals: CoreWebVital[] = [];

  for (const id of CORE_WEB_VITALS_IDS) {
    const audit = audits[id];
    if (audit && audit.scoreDisplayMode !== "not_applicable") {
      vitals.push({
        id: audit.id,
        name: audit.title,
        value: audit.displayValue || "N/A",
        score: audit.score,
        description: audit.description,
        category: getScoreCategory(audit.score),
      });
    }
  }

  return vitals;
}

/**
 * Extracts opportunities (audits with potential savings)
 */
function extractOpportunities(
  audits: Record<string, Audit>
): Opportunity[] {
  const opportunities: Opportunity[] = [];

  for (const id of OPPORTUNITY_IDS) {
    const audit = audits[id];
    if (
      audit &&
      audit.score !== null &&
      audit.score < 1 &&
      audit.scoreDisplayMode !== "not_applicable"
    ) {
      let savings: string | undefined;
      if (audit.details?.overallSavingsMs) {
        savings = `${Math.round(audit.details.overallSavingsMs)} ms`;
      } else if (audit.details?.overallSavingsBytes) {
        const kb = Math.round(audit.details.overallSavingsBytes / 1024);
        savings = `${kb} KB`;
      }

      opportunities.push({
        id: audit.id,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        displayValue: audit.displayValue,
        savings,
      });
    }
  }

  // Sort by score (worst first)
  return opportunities.sort((a, b) => (a.score || 0) - (b.score || 0));
}

/**
 * Extracts diagnostic audits (informative, not necessarily bad)
 */
function extractDiagnostics(
  audits: Record<string, Audit>
): Opportunity[] {
  const diagnostics: Opportunity[] = [];
  const skipIds = new Set([...CORE_WEB_VITALS_IDS, ...OPPORTUNITY_IDS]);

  for (const [id, audit] of Object.entries(audits)) {
    if (
      !skipIds.has(id) &&
      audit.score !== null &&
      audit.score < 1 &&
      audit.scoreDisplayMode === "numeric"
    ) {
      diagnostics.push({
        id: audit.id,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        displayValue: audit.displayValue,
      });
    }
  }

  return diagnostics.sort((a, b) => (a.score || 0) - (b.score || 0)).slice(0, 10);
}

/**
 * Counts passed and total audits
 */
function countAudits(audits: Record<string, Audit>): {
  passed: number;
  total: number;
} {
  let passed = 0;
  let total = 0;

  for (const audit of Object.values(audits)) {
    if (
      audit.scoreDisplayMode === "numeric" ||
      audit.scoreDisplayMode === "binary"
    ) {
      total++;
      if (audit.score === 1) {
        passed++;
      }
    }
  }

  return { passed, total };
}

/**
 * Transforms PageSpeed API response into our normalized format
 */
function transformResponse(
  data: PageSpeedResponse,
  strategy: Strategy
): AnalysisResult {
  const { lighthouseResult } = data;
  const { categories, audits } = lighthouseResult;

  const auditCounts = countAudits(audits);

  return {
    url: lighthouseResult.requestedUrl,
    finalUrl: lighthouseResult.finalUrl,
    strategy,
    fetchTime: data.analysisUTCTimestamp,
    scores: {
      performance: categories.performance
        ? {
            score: Math.round((categories.performance.score || 0) * 100),
            title: categories.performance.title,
            description: categories.performance.description,
          }
        : null,
      accessibility: categories.accessibility
        ? {
            score: Math.round((categories.accessibility.score || 0) * 100),
            title: categories.accessibility.title,
            description: categories.accessibility.description,
          }
        : null,
      bestPractices: categories["best-practices"]
        ? {
            score: Math.round((categories["best-practices"].score || 0) * 100),
            title: categories["best-practices"].title,
            description: categories["best-practices"].description,
          }
        : null,
      seo: categories.seo
        ? {
            score: Math.round((categories.seo.score || 0) * 100),
            title: categories.seo.title,
            description: categories.seo.description,
          }
        : null,
    },
    coreWebVitals: extractCoreWebVitals(audits),
    opportunities: extractOpportunities(audits),
    diagnostics: extractDiagnostics(audits),
    passedAudits: auditCounts.passed,
    totalAudits: auditCounts.total,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let url = searchParams.get("url");
  const strategy = (searchParams.get("strategy") || "mobile") as Strategy;

  // Validate URL parameter
  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required", code: "MISSING_URL" },
      { status: 400 }
    );
  }

  // Normalize and validate URL
  url = normalizeUrl(url);

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: "Invalid URL format", code: "INVALID_URL" },
      { status: 400 }
    );
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json(
      {
        error: "This URL cannot be analyzed (localhost or internal IPs are not allowed)",
        code: "FORBIDDEN_URL",
      },
      { status: 400 }
    );
  }

  // Validate strategy
  if (strategy !== "desktop" && strategy !== "mobile") {
    return NextResponse.json(
      { error: "Strategy must be 'desktop' or 'mobile'", code: "INVALID_STRATEGY" },
      { status: 400 }
    );
  }

  try {
    // Build PageSpeed API URL
    const apiUrl = new URL(PAGESPEED_API_URL);
    apiUrl.searchParams.set("url", url);
    apiUrl.searchParams.set("strategy", strategy);

    // Add all categories
    for (const category of CATEGORIES) {
      apiUrl.searchParams.append("category", category);
    }

    // Add API key if available
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (apiKey) {
      apiUrl.searchParams.set("key", apiKey);
    }

    // Call PageSpeed API
    const response = await fetch(apiUrl.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to analyze the URL";

      // Try to parse error response
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch {
        // Use default error message
      }

      return NextResponse.json(
        {
          error: errorMessage,
          code: "API_ERROR",
          details: `Status: ${response.status}`,
        },
        { status: response.status >= 500 ? 502 : 400 }
      );
    }

    const data: PageSpeedResponse = await response.json();

    // Check for runtime errors in Lighthouse
    if (data.lighthouseResult?.runtimeError) {
      return NextResponse.json(
        {
          error: data.lighthouseResult.runtimeError.message || "Analysis failed",
          code: data.lighthouseResult.runtimeError.code || "LIGHTHOUSE_ERROR",
        },
        { status: 400 }
      );
    }

    // Transform and return the result
    const result = transformResponse(data, strategy);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("PageSpeed API error:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred while analyzing the URL",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

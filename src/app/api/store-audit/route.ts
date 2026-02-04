import { NextRequest, NextResponse } from "next/server";
import {
  runAllTests,
  extractStoreName,
} from "@/lib/store-audit-tests";
import type {
  StoreAuditResult,
  StoreAuditError,
  AuditTest,
} from "@/types/store-audit";

// URL validation
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Normalize URL
function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

// Block internal/private URLs
function isAllowedUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
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

// Calculate global score from categories
function calculateGlobalScore(categories: StoreAuditResult["categories"]): number {
  if (categories.length === 0) return 0;
  
  // Weight categories differently
  const weights: Record<string, number> = {
    trust: 2,
    checkout: 2,
    shipping: 1.5,
    performance: 1.5,
    products: 1.5,
    descriptions: 1,
    search: 1,
    urgency: 1,
    upselling: 1,
    seo: 1,
  };
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const cat of categories) {
    const weight = weights[cat.category] || 1;
    totalWeight += weight;
    weightedSum += cat.score * weight;
  }
  
  return Math.round(weightedSum / totalWeight);
}

// Get summary counts
function getSummary(categories: StoreAuditResult["categories"]): StoreAuditResult["summary"] {
  let passed = 0;
  let failed = 0;
  let warnings = 0;
  let total = 0;
  
  for (const cat of categories) {
    for (const test of cat.tests) {
      total++;
      if (test.status === "pass") passed++;
      else if (test.status === "fail") failed++;
      else if (test.status === "warning") warnings++;
    }
  }
  
  return { passed, failed, warnings, total };
}

// Get critical issues (failed tests with high weight)
function getCriticalIssues(categories: StoreAuditResult["categories"]): AuditTest[] {
  const critical: AuditTest[] = [];
  
  for (const cat of categories) {
    for (const test of cat.tests) {
      if (test.status === "fail" && test.weight >= 2) {
        critical.push(test);
      }
    }
  }
  
  return critical.slice(0, 5); // Top 5 critical issues
}

// Get top recommendations
function getTopRecommendations(categories: StoreAuditResult["categories"]): string[] {
  const recommendations: { text: string; weight: number }[] = [];
  
  for (const cat of categories) {
    for (const test of cat.tests) {
      if (test.status === "fail" && test.recommendation) {
        recommendations.push({
          text: test.recommendation,
          weight: test.weight,
        });
      }
    }
  }
  
  // Sort by weight and return top 5
  recommendations.sort((a, b) => b.weight - a.weight);
  return recommendations.slice(0, 5).map(r => r.text);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let url = searchParams.get("url");

  if (!url) {
    return NextResponse.json<StoreAuditError>(
      { error: true, code: "MISSING_URL", message: "URL is required" },
      { status: 400 }
    );
  }

  // Normalize and validate URL
  url = normalizeUrl(url);
  
  if (!isValidUrl(url)) {
    return NextResponse.json<StoreAuditError>(
      { error: true, code: "INVALID_URL", message: "Invalid URL format" },
      { status: 400 }
    );
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json<StoreAuditError>(
      { error: true, code: "BLOCKED_URL", message: "URL is not allowed (localhost/private IPs)" },
      { status: 400 }
    );
  }

  try {
    const startTime = Date.now();

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FlamingoDevs StoreAudit/1.0; +https://flamingodevs.com)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return NextResponse.json<StoreAuditError>(
        {
          error: true,
          code: "FETCH_ERROR",
          message: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        },
        { status: 400 }
      );
    }

    const html = await response.text();
    const analysisTime = Date.now() - startTime;

    // Convert headers to object
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Run all tests
    const { categories, platform, platformConfidence } = runAllTests(
      html,
      response.url,
      headers,
      responseTime
    );

    // Extract store name
    const storeName = extractStoreName(html, response.url);

    // Calculate scores and summaries
    const globalScore = calculateGlobalScore(categories);
    const summary = getSummary(categories);
    const criticalIssues = getCriticalIssues(categories);
    const topRecommendations = getTopRecommendations(categories);

    // Build result
    const result: StoreAuditResult = {
      url,
      finalUrl: response.url,
      storeName,
      platform,
      platformConfidence,
      globalScore,
      categories,
      summary,
      criticalIssues,
      topRecommendations,
      fetchTime: new Date().toISOString(),
      analysisTime,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Store audit error:", error);
    
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json<StoreAuditError>(
        { error: true, code: "NETWORK_ERROR", message: "Could not connect to the website" },
        { status: 400 }
      );
    }

    return NextResponse.json<StoreAuditError>(
      { error: true, code: "UNEXPECTED_ERROR", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

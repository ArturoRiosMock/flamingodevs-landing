import { NextRequest, NextResponse } from "next/server";
import { techSignatures } from "@/lib/tech-signatures";
import type {
  Technology,
  TechDetectorResult,
  TechDetectorError,
  TechSignature,
} from "@/types/tech-detector";

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
    
    // Block localhost and private IPs
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

// Extract scripts from HTML
function extractScripts(html: string): string[] {
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const scripts: string[] = [];
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  return scripts;
}

// Extract stylesheets from HTML
function extractStyles(html: string): string[] {
  const styleRegex = /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>|<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const styles: string[] = [];
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    styles.push(match[1] || match[2]);
  }
  return styles;
}

// Extract meta tags from HTML
function extractMeta(html: string): { name?: string; property?: string; content?: string }[] {
  const metaRegex = /<meta[^>]*(?:name=["']([^"']+)["'][^>]*content=["']([^"']+)["']|content=["']([^"']+)["'][^>]*name=["']([^"']+)["']|property=["']([^"']+)["'][^>]*content=["']([^"']+)["']|content=["']([^"']+)["'][^>]*property=["']([^"']+)["'])[^>]*>/gi;
  const metas: { name?: string; property?: string; content?: string }[] = [];
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    if (match[1] && match[2]) {
      metas.push({ name: match[1], content: match[2] });
    } else if (match[3] && match[4]) {
      metas.push({ name: match[4], content: match[3] });
    } else if (match[5] && match[6]) {
      metas.push({ property: match[5], content: match[6] });
    } else if (match[7] && match[8]) {
      metas.push({ property: match[8], content: match[7] });
    }
  }
  return metas;
}

// Extract page title
function extractTitle(html: string): string | undefined {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : undefined;
}

// Extract generator meta tag
function extractGenerator(html: string): string | undefined {
  const generatorMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']([^"']+)["'][^>]*>|<meta[^>]*content=["']([^"']+)["'][^>]*name=["']generator["'][^>]*>/i);
  return generatorMatch ? (generatorMatch[1] || generatorMatch[2]) : undefined;
}

// Check if a technology matches
function matchTechnology(
  signature: TechSignature,
  html: string,
  scripts: string[],
  styles: string[],
  metas: { name?: string; property?: string; content?: string }[],
  headers: Record<string, string>,
  generator?: string
): { matched: boolean; confidence: "high" | "medium" | "low" } {
  let matchCount = 0;
  let totalPatterns = 0;

  // Check HTML patterns
  if (signature.patterns.html) {
    for (const pattern of signature.patterns.html) {
      totalPatterns++;
      if (pattern.test(html)) {
        matchCount++;
      }
    }
  }

  // Check script patterns
  if (signature.patterns.scripts) {
    for (const pattern of signature.patterns.scripts) {
      totalPatterns++;
      for (const script of scripts) {
        if (pattern.test(script)) {
          matchCount++;
          break;
        }
      }
    }
  }

  // Check style patterns
  if (signature.patterns.styles) {
    for (const pattern of signature.patterns.styles) {
      totalPatterns++;
      for (const style of styles) {
        if (pattern.test(style)) {
          matchCount++;
          break;
        }
      }
    }
  }

  // Check meta patterns
  if (signature.patterns.meta) {
    for (const metaPattern of signature.patterns.meta) {
      totalPatterns++;
      for (const meta of metas) {
        if (metaPattern.name && meta.name?.toLowerCase() === metaPattern.name.toLowerCase()) {
          if (!metaPattern.content || (meta.content && metaPattern.content.test(meta.content))) {
            matchCount++;
            break;
          }
        }
        if (metaPattern.property && meta.property?.toLowerCase() === metaPattern.property.toLowerCase()) {
          if (!metaPattern.content || (meta.content && metaPattern.content.test(meta.content))) {
            matchCount++;
            break;
          }
        }
      }
    }
  }

  // Check header patterns
  if (signature.patterns.headers) {
    for (const headerPattern of signature.patterns.headers) {
      totalPatterns++;
      const headerValue = headers[headerPattern.name.toLowerCase()];
      if (headerValue !== undefined) {
        if (!headerPattern.value || headerPattern.value.test(headerValue)) {
          matchCount++;
        }
      }
    }
  }

  // Check generator pattern
  if (signature.patterns.generator && generator) {
    for (const pattern of signature.patterns.generator) {
      totalPatterns++;
      if (pattern.test(generator)) {
        matchCount++;
      }
    }
  }

  if (matchCount === 0) {
    return { matched: false, confidence: "low" };
  }

  const matchRatio = matchCount / totalPatterns;
  let confidence: "high" | "medium" | "low";
  
  if (matchRatio >= 0.5 || matchCount >= 2) {
    confidence = "high";
  } else if (matchCount >= 1) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return { matched: true, confidence };
}

// Detect all technologies
function detectTechnologies(
  html: string,
  headers: Record<string, string>
): Technology[] {
  const scripts = extractScripts(html);
  const styles = extractStyles(html);
  const metas = extractMeta(html);
  const generator = extractGenerator(html);

  const detected: Technology[] = [];

  for (const signature of techSignatures) {
    const { matched, confidence } = matchTechnology(
      signature,
      html,
      scripts,
      styles,
      metas,
      headers,
      generator
    );

    if (matched) {
      detected.push({
        name: signature.name,
        category: signature.category,
        website: signature.website,
        description: signature.description,
        confidence,
      });
    }
  }

  // Sort by confidence (high first) then by name
  detected.sort((a, b) => {
    const confidenceOrder = { high: 0, medium: 1, low: 2 };
    if (confidenceOrder[a.confidence] !== confidenceOrder[b.confidence]) {
      return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    }
    return a.name.localeCompare(b.name);
  });

  return detected;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let url = searchParams.get("url");

  if (!url) {
    return NextResponse.json<TechDetectorError>(
      { error: true, code: "MISSING_URL", message: "URL is required" },
      { status: 400 }
    );
  }

  // Normalize and validate URL
  url = normalizeUrl(url);
  
  if (!isValidUrl(url)) {
    return NextResponse.json<TechDetectorError>(
      { error: true, code: "INVALID_URL", message: "Invalid URL format" },
      { status: 400 }
    );
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json<TechDetectorError>(
      { error: true, code: "BLOCKED_URL", message: "URL is not allowed (localhost/private IPs)" },
      { status: 400 }
    );
  }

  try {
    const startTime = Date.now();

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FlamingoDevs TechDetector/1.0; +https://flamingodevs.com)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json<TechDetectorError>(
        {
          error: true,
          code: "FETCH_ERROR",
          message: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        },
        { status: 400 }
      );
    }

    const html = await response.text();
    const responseTime = Date.now() - startTime;

    // Convert headers to object
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Detect technologies
    const technologies = detectTechnologies(html, headers);

    // Extract additional info
    const title = extractTitle(html);
    const generator = extractGenerator(html);
    const metas = extractMeta(html);
    const description = metas.find(m => m.name?.toLowerCase() === "description")?.content;

    // Build result
    const result: TechDetectorResult = {
      url,
      finalUrl: response.url,
      title,
      technologies,
      meta: {
        generator,
        description,
      },
      headers,
      fetchTime: new Date().toISOString(),
      responseTime,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Tech detector error:", error);
    
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json<TechDetectorError>(
        { error: true, code: "NETWORK_ERROR", message: "Could not connect to the website" },
        { status: 400 }
      );
    }

    return NextResponse.json<TechDetectorError>(
      { error: true, code: "UNEXPECTED_ERROR", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

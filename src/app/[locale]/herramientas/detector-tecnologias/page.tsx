"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { TechDetectorReport } from "@/components/tools";
import type { TechDetectorResult, TechDetectorError } from "@/types/tech-detector";

type DetectorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: TechDetectorResult }
  | { status: "error"; error: TechDetectorError };

export default function TechDetectorPage() {
  const t = useTranslations("tools.techDetector");
  const locale = useLocale();
  const [state, setState] = useState<DetectorState>({ status: "idle" });
  const [url, setUrl] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setState({ status: "loading" });

    try {
      const params = new URLSearchParams({ url: url.trim() });
      const response = await fetch(`/api/tech-detector?${params}`);
      const data = await response.json();

      if (data.error) {
        setState({ status: "error", error: data as TechDetectorError });
      } else {
        setState({ status: "success", data: data as TechDetectorResult });
      }
    } catch {
      setState({
        status: "error",
        error: {
          error: true,
          code: "UNEXPECTED_ERROR",
          message: t("errors.unexpected"),
        },
      });
    }
  };

  const handleNewAnalysis = () => {
    setState({ status: "idle" });
    setUrl("");
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
            {t("breadcrumb.home")}
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/herramientas`}
            className="hover:text-foreground transition-colors"
          >
            {t("breadcrumb.tools")}
          </Link>
          <span>/</span>
          <span className="text-foreground">{t("breadcrumb.detector")}</span>
        </nav>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleAnalyze} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("placeholder")}
                disabled={state.status === "loading"}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={state.status === "loading" || !url.trim()}
              className="px-8 py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state.status === "loading" ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("analyzing")}
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  {t("detect")}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {state.status === "loading" && (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-border" />
              <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("loading.title")}
            </h3>
            <p className="text-muted">{t("loading.description")}</p>
          </div>
        )}

        {/* Error State */}
        {state.status === "error" && (
          <div className="bg-red-500/10 rounded-2xl border border-red-500/20 p-8 text-center">
            <svg
              className="h-12 w-12 mx-auto text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("error.title")}
            </h3>
            <p className="text-muted mb-4">{state.error.message}</p>
            <button
              onClick={handleNewAnalysis}
              className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 transition-all"
            >
              {t("error.tryAgain")}
            </button>
          </div>
        )}

        {/* Success State */}
        {state.status === "success" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleNewAnalysis}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                {t("newAnalysis")}
              </button>
            </div>
            <TechDetectorReport result={state.data} />
          </>
        )}

        {/* Info Section for Idle State */}
        {state.status === "idle" && (
          <div className="space-y-8 mt-12">
            {/* What we detect */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
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
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
                {t("info.whatWeDetect.title")}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: "document", label: t("info.whatWeDetect.cms") },
                  { icon: "code", label: t("info.whatWeDetect.frameworks") },
                  { icon: "chart", label: t("info.whatWeDetect.analytics") },
                  { icon: "cart", label: t("info.whatWeDetect.ecommerce") },
                  { icon: "server", label: t("info.whatWeDetect.hosting") },
                  { icon: "shield", label: t("info.whatWeDetect.security") },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
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
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Use cases */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
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
                {t("info.useCases.title")}
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {t("info.useCases.competition.title")}
                    </h3>
                    <p className="text-sm text-muted">
                      {t("info.useCases.competition.description")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {t("info.useCases.learn.title")}
                    </h3>
                    <p className="text-sm text-muted">
                      {t("info.useCases.learn.description")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {t("info.useCases.sales.title")}
                    </h3>
                    <p className="text-sm text-muted">
                      {t("info.useCases.sales.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

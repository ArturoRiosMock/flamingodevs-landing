"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { AnalyzerForm, AnalysisReport } from "@/components/tools";
import type { AnalysisResult, AnalysisError, Strategy } from "@/types/pagespeed";

type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: AnalysisResult }
  | { status: "error"; error: AnalysisError };

export default function WebAnalyzerPage() {
  const t = useTranslations("tools.analyzer");
  const locale = useLocale();
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

  const handleAnalyze = async (url: string, strategy: Strategy) => {
    setState({ status: "loading" });

    try {
      const params = new URLSearchParams({ url, strategy });
      const response = await fetch(`/api/analyze?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setState({
          status: "error",
          error: data as AnalysisError,
        });
        return;
      }

      setState({
        status: "success",
        data: data as AnalysisResult,
      });
    } catch {
      setState({
        status: "error",
        error: {
          error: t("errors.unexpected"),
          code: "NETWORK_ERROR",
        },
      });
    }
  };

  const handleNewAnalysis = () => {
    setState({ status: "idle" });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted">
              <li>
                <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                  {t("breadcrumb.home")}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/${locale}/herramientas`} className="hover:text-foreground transition-colors">
                  {t("breadcrumb.tools")}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{t("breadcrumb.analyzer")}</li>
            </ol>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-muted mb-8">
              {t("subtitle")}
            </p>
          </div>

          {/* Form */}
          <div className="mt-8">
            <AnalyzerForm
              onAnalyze={handleAnalyze}
              isLoading={state.status === "loading"}
            />
          </div>

          {/* Loading State */}
          {state.status === "loading" && (
            <div className="mt-16 text-center">
              <div className="inline-flex flex-col items-center gap-4 p-8 bg-card rounded-2xl border border-border">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-muted/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">{t("loading.title")}</p>
                  <p className="text-sm text-muted">{t("loading.description")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {state.status === "error" && (
            <div className="mt-16 max-w-2xl mx-auto">
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-red-500"
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
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{t("error.title")}</h3>
                    <p className="mt-1 text-muted">{state.error.error}</p>
                    {state.error.details && (
                      <p className="mt-2 text-sm text-muted/70">{state.error.details}</p>
                    )}
                    <button
                      onClick={handleNewAnalysis}
                      className="mt-4 text-sm font-medium text-accent hover:underline"
                    >
                      {t("error.tryAgain")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {state.status === "success" && (
        <section className="py-8 pb-24">
          <div className="mx-auto max-w-6xl px-6">
            {/* New Analysis Button */}
            <div className="mb-8 flex justify-end">
              <button
                onClick={handleNewAnalysis}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground border border-border rounded-xl hover:bg-card transition-all"
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

            <AnalysisReport result={state.data} />
          </div>
        </section>
      )}

      {/* Info Section (only when idle) */}
      {state.status === "idle" && (
        <section className="py-16 border-t border-border">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {/* What it measures */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("info.whatMeasures.title")}
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                      ),
                      title: t("info.whatMeasures.performance.title"),
                      description: t("info.whatMeasures.performance.description"),
                    },
                    {
                      icon: (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      ),
                      title: t("info.whatMeasures.accessibility.title"),
                      description: t("info.whatMeasures.accessibility.description"),
                    },
                    {
                      icon: (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      ),
                      title: t("info.whatMeasures.bestPractices.title"),
                      description: t("info.whatMeasures.bestPractices.description"),
                    },
                    {
                      icon: (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      ),
                      title: t("info.whatMeasures.seo.title"),
                      description: t("info.whatMeasures.seo.description"),
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why it matters */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("info.whyMatters.title")}
                </h2>
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  <p className="text-muted leading-relaxed">
                    {t("info.whyMatters.description1")}
                  </p>
                  <p className="text-muted leading-relaxed">
                    {t("info.whyMatters.description2")}
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-3">
                      {t("info.whyMatters.stats.title")}
                    </p>
                    <ul className="space-y-2 text-sm text-muted">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {t("info.whyMatters.stats.item1")}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {t("info.whyMatters.stats.item2")}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {t("info.whyMatters.stats.item3")}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

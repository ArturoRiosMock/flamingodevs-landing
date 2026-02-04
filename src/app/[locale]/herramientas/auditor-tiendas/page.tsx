"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { StoreAuditReport } from "@/components/tools";
import type { StoreAuditResult, StoreAuditError } from "@/types/store-audit";

type AuditState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: StoreAuditResult }
  | { status: "error"; error: StoreAuditError };

export default function StoreAuditPage() {
  const t = useTranslations("tools.storeAudit");
  const locale = useLocale();
  const [state, setState] = useState<AuditState>({ status: "idle" });
  const [url, setUrl] = useState("");

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setState({ status: "loading" });

    try {
      const params = new URLSearchParams({ url: url.trim() });
      const response = await fetch(`/api/store-audit?${params}`);
      const data = await response.json();

      if (data.error) {
        setState({ status: "error", error: data as StoreAuditError });
      } else {
        setState({ status: "success", data: data as StoreAuditResult });
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

  const handleNewAudit = () => {
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
          <span className="text-foreground">{t("breadcrumb.auditor")}</span>
        </nav>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleAudit} className="mb-8">
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
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
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
                  {t("auditing")}
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
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                  {t("audit")}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {state.status === "loading" && (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Animated store icon */}
              <svg
                className="w-full h-full text-accent animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                />
              </svg>
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
              <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("loading.title")}
            </h3>
            <p className="text-muted mb-4">{t("loading.description")}</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted">
              <span className="px-2 py-1 bg-muted/10 rounded">Confianza</span>
              <span className="px-2 py-1 bg-muted/10 rounded">Checkout</span>
              <span className="px-2 py-1 bg-muted/10 rounded">Envío</span>
              <span className="px-2 py-1 bg-muted/10 rounded">Productos</span>
              <span className="px-2 py-1 bg-muted/10 rounded">SEO</span>
            </div>
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
              onClick={handleNewAudit}
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
                onClick={handleNewAudit}
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
                {t("newAudit")}
              </button>
            </div>
            <StoreAuditReport result={state.data} />
          </>
        )}

        {/* Info Section for Idle State */}
        {state.status === "idle" && (
          <div className="space-y-8 mt-12">
            {/* What we test */}
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
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
                {t("info.whatWeTest.title")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: "shield", label: t("info.whatWeTest.trust") },
                  { icon: "cart", label: t("info.whatWeTest.checkout") },
                  { icon: "truck", label: t("info.whatWeTest.shipping") },
                  { icon: "speed", label: t("info.whatWeTest.performance") },
                  { icon: "image", label: t("info.whatWeTest.products") },
                  { icon: "text", label: t("info.whatWeTest.descriptions") },
                  { icon: "search", label: t("info.whatWeTest.search") },
                  { icon: "clock", label: t("info.whatWeTest.urgency") },
                  { icon: "trending", label: t("info.whatWeTest.upselling") },
                  { icon: "globe", label: t("info.whatWeTest.seo") },
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

            {/* Problems we detect */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
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
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                {t("info.problems.title")}
              </h2>
              <div className="space-y-4">
                {[
                  { emoji: "🛒", text: t("info.problems.cart") },
                  { emoji: "💳", text: t("info.problems.checkout") },
                  { emoji: "📦", text: t("info.problems.shipping") },
                  { emoji: "🔒", text: t("info.problems.trust") },
                  { emoji: "🐌", text: t("info.problems.speed") },
                  { emoji: "📸", text: t("info.problems.photos") },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <p className="text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Supported platforms */}
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
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                  />
                </svg>
                {t("info.platforms.title")}
              </h2>
              <div className="flex flex-wrap gap-3">
                {["Shopify", "WooCommerce", "Magento", "PrestaShop", "Tiendanube", "VTEX", "Custom"].map((platform) => (
                  <span
                    key={platform}
                    className="px-4 py-2 bg-background rounded-lg text-sm font-medium text-foreground"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

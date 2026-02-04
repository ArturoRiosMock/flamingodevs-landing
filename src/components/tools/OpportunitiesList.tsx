"use client";

import { useState } from "react";
import type { Opportunity } from "@/types/pagespeed";

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  title?: string;
  emptyMessage?: string;
}

function getScoreColor(score: number | null): string {
  if (score === null) return "bg-gray-500";
  if (score >= 0.9) return "bg-green-500";
  if (score >= 0.5) return "bg-orange-500";
  return "bg-red-500";
}

function getScoreWidth(score: number | null): string {
  if (score === null) return "w-0";
  return `${Math.round(score * 100)}%`;
}

export default function OpportunitiesList({
  opportunities,
  title = "Oportunidades de mejora",
  emptyMessage = "No hay oportunidades de mejora identificadas",
}: OpportunitiesListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (opportunities.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {title}
        </h3>
        <p className="text-muted text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-orange-500"
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
        {title}
        <span className="ml-auto text-sm font-normal text-muted">
          {opportunities.length} {opportunities.length === 1 ? "item" : "items"}
        </span>
      </h3>

      <div className="space-y-3">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="border border-border rounded-xl overflow-hidden hover:border-muted transition-colors"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === opportunity.id ? null : opportunity.id)
              }
              className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-muted/5 transition-colors"
            >
              {/* Score indicator */}
              <div className="flex-shrink-0 w-12">
                <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreColor(opportunity.score)} transition-all duration-500`}
                    style={{ width: getScoreWidth(opportunity.score) }}
                  />
                </div>
                <span className="text-xs text-muted mt-1 block text-center">
                  {opportunity.score !== null
                    ? Math.round(opportunity.score * 100)
                    : "N/A"}
                </span>
              </div>

              {/* Title and value */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {opportunity.title}
                </p>
                {opportunity.displayValue && (
                  <p className="text-sm text-muted truncate">
                    {opportunity.displayValue}
                  </p>
                )}
              </div>

              {/* Savings badge */}
              {opportunity.savings && (
                <span className="flex-shrink-0 px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-medium rounded-lg">
                  Ahorro: {opportunity.savings}
                </span>
              )}

              {/* Expand icon */}
              <svg
                className={`flex-shrink-0 h-5 w-5 text-muted transition-transform ${
                  expandedId === opportunity.id ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* Expanded description */}
            {expandedId === opportunity.id && (
              <div className="px-4 pb-4 pt-0">
                <p className="text-sm text-muted leading-relaxed border-t border-border pt-3">
                  {opportunity.description.replace(
                    /\[.*?\]\(.*?\)/g,
                    (match) => {
                      const text = match.match(/\[(.*?)\]/)?.[1] || "";
                      return text;
                    }
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

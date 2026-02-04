"use client";

import { useEffect, useState } from "react";
import { getScoreColor, getScoreLabel } from "@/types/store-audit";

interface AuditScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function AuditScoreCircle({
  score,
  size = "lg",
  showLabel = true,
}: AuditScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const sizes = {
    sm: { ring: 80, stroke: 6, text: "text-xl", label: "text-xs" },
    md: { ring: 120, stroke: 8, text: "text-3xl", label: "text-sm" },
    lg: { ring: 180, stroke: 10, text: "text-5xl", label: "text-base" },
  };

  const { ring, stroke, text, label } = sizes[size];
  const radius = (ring - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((100 - animatedScore) / 100) * circumference;

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "stroke-green-500";
    if (score >= 50) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: ring, height: ring }}>
        {/* Background ring */}
        <svg className="transform -rotate-90" width={ring} height={ring}>
          <circle
            className="stroke-muted/20"
            strokeWidth={stroke}
            fill="none"
            r={radius}
            cx={ring / 2}
            cy={ring / 2}
          />
          {/* Progress ring */}
          <circle
            className={`transition-all duration-1000 ease-out ${getStrokeColor(score)}`}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            r={radius}
            cx={ring / 2}
            cy={ring / 2}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${text} font-bold ${getScoreColor(score)}`}>
            {animatedScore}
          </span>
          {size === "lg" && (
            <span className="text-sm text-muted">de 100</span>
          )}
        </div>
      </div>
      {showLabel && (
        <span className={`${label} font-medium ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
}

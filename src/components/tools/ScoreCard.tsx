"use client";

import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-500";
}

function getScoreRingColor(score: number): string {
  if (score >= 90) return "stroke-green-500";
  if (score >= 50) return "stroke-orange-500";
  return "stroke-red-500";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Bueno";
  if (score >= 50) return "Necesita mejoras";
  return "Pobre";
}

export default function ScoreCard({
  score,
  title,
  description,
  size = "md",
}: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const sizes = {
    sm: { ring: 80, stroke: 6, text: "text-xl", label: "text-xs" },
    md: { ring: 100, stroke: 8, text: "text-3xl", label: "text-sm" },
    lg: { ring: 140, stroke: 10, text: "text-4xl", label: "text-base" },
  };

  const { ring, stroke, text, label } = sizes[size];
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="relative" style={{ width: ring, height: ring }}>
        {/* Background ring */}
        <svg
          className="transform -rotate-90"
          width={ring}
          height={ring}
        >
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/20"
          />
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${getScoreRingColor(score)} transition-all duration-1000 ease-out`}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${text} font-bold ${getScoreColor(score)}`}>
            {animatedScore}
          </span>
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span
          className={`inline-block mt-1 px-2 py-0.5 rounded-full ${label} font-medium ${getScoreBgColor(score)} text-white`}
        >
          {getScoreLabel(score)}
        </span>
        {description && (
          <p className="mt-2 text-xs text-muted max-w-[200px]">{description}</p>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type AnimationType = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "scale" 
  | "blur";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  as?: React.ElementType;
}

const animationStyles: Record<AnimationType, { initial: string; visible: string }> = {
  "fade-up": {
    initial: "opacity-0 translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    initial: "opacity-0 -translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    initial: "opacity-0 -translate-x-12",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    initial: "opacity-0 translate-x-12",
    visible: "opacity-100 translate-x-0",
  },
  scale: {
    initial: "opacity-0 scale-90",
    visible: "opacity-100 scale-100",
  },
  blur: {
    initial: "opacity-0 blur-sm",
    visible: "opacity-100 blur-0",
  },
};

export default function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
  threshold = 0.1,
  as: Component = "div",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });

  const styles = animationStyles[animation];

  return (
    <Component
      ref={ref}
      className={`transition-all ease-out ${
        isVisible ? styles.visible : styles.initial
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 100,
}: StaggerContainerProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

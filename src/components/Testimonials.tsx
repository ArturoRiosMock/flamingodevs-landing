"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-muted/30"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Workana badge component
function WorkanaBadge() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
        <path d="M15 8l-6 8m0-8l6 8" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <span>Workana</span>
    </div>
  );
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  project: string;
  skills: string[];
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const locale = useLocale();

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "M. García",
      role: t("testimonial1.role"),
      location: "España",
      rating: 5,
      text: t("testimonial1.text"),
      project: "WordPress",
      skills: ["WordPress", "PHP", "JavaScript"],
    },
    {
      id: 2,
      name: "R. Sánchez",
      role: t("testimonial2.role"),
      location: "México",
      rating: 5,
      text: t("testimonial2.text"),
      project: "Shopify",
      skills: ["Shopify", "Liquid", "CSS"],
    },
    {
      id: 3,
      name: "A. Yamamoto",
      role: t("testimonial3.role"),
      location: "Costa Rica",
      rating: 5,
      text: t("testimonial3.text"),
      project: "E-commerce",
      skills: ["WordPress", "WooCommerce", "SEO"],
    },
    {
      id: 4,
      name: "F. González",
      role: t("testimonial4.role"),
      location: "España",
      rating: 5,
      text: t("testimonial4.text"),
      project: "Shopify",
      skills: ["Shopify", "API", "JavaScript"],
    },
    {
      id: 5,
      name: "Isabel M.",
      role: t("testimonial5.role"),
      location: "Ecuador",
      rating: 5,
      text: t("testimonial5.text"),
      project: "Full Stack",
      skills: ["Next.js", "Node.js", "React"],
    },
    {
      id: 6,
      name: "A. Estrada",
      role: t("testimonial6.role"),
      location: "USA",
      rating: 5,
      text: t("testimonial6.text"),
      project: "Automatización",
      skills: ["IA", "API", "N8N"],
    },
  ];

  return (
    <section className="py-24 bg-card overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>5.0 / 5.0 — {t("badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection delay={100} className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 rounded-2xl bg-background border border-border">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">48+</div>
              <div className="text-sm text-muted">{t("stats.clients")}</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background border border-border">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">5.0</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <StarRating rating={5} />
              </div>
              <div className="text-sm text-muted">{t("stats.rating")}</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background border border-border">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">42+</div>
              <div className="text-sm text-muted">{t("stats.projects")}</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">HERO</div>
              <div className="text-sm text-muted">{t("stats.level")}</div>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <AnimatedSection key={testimonial.id} delay={150 + idx * 50}>
              <div className="group h-full flex flex-col p-6 rounded-2xl bg-background border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-muted/20 flex items-center justify-center text-lg font-bold text-foreground">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Quote */}
                <div className="flex-1 mb-4">
                  <svg className="h-6 w-6 text-accent/30 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-muted leading-relaxed">
                    &quot;{testimonial.text}&quot;
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span>{testimonial.location}</span>
                    </div>
                    <div className="flex gap-1">
                      {testimonial.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-full bg-muted/20 text-xs text-muted"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Workana CTA */}
        <AnimatedSection delay={500} className="mt-12">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-background via-muted/5 to-background border border-border">
            <p className="text-muted mb-4">{t("cta.text")}</p>
            <a
              href="https://www.workana.com/freelancer/ba7ac8f9ffb8d2bc4f2d708dd5c2e897"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 hover:scale-105 transition-all"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                <path d="M15 8l-6 8m0-8l6 8" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              {t("cta.button")}
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

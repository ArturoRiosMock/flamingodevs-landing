"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";

function AnimatedCounter({ value, suffix = "", duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
      {count}{suffix}
    </div>
  );
}

export default function Trust() {
  const t = useTranslations("trust");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 5, suffix: "+", label: t("experience") },
    { value: 50, suffix: "+", label: t("projects") },
    { value: 30, suffix: "+", label: t("clients") },
  ];

  const badges = [
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.164-.137-1.227 1.127-1.227 1.127l-1.372 19.903h1.587z"/>
          <path d="M11.906 8.238l-.668 2.027s-.746-.399-1.646-.399c-1.333 0-1.4.836-1.4 1.047 0 1.149 3 1.588 3 4.281 0 2.119-1.343 3.481-3.154 3.481-2.172 0-3.283-1.352-3.283-1.352l.582-1.922s1.143.982 2.108.982c.63 0 .887-.496.887-.858 0-1.5-2.462-1.567-2.462-4.028 0-2.073 1.487-4.079 4.492-4.079 1.158 0 1.544.332 1.544.332z"/>
        </svg>
      ),
      label: t("shopifyPartner"),
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
      label: t("certifiedDev"),
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group text-center p-8 rounded-2xl bg-card border border-border transition-all duration-700 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="text-muted group-hover:text-foreground transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`group flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border transition-all duration-500 hover:scale-105 hover:border-accent/30 hover:shadow-md ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${600 + index * 100}ms` }}
            >
              <div className="text-accent group-hover:scale-110 transition-transform">{badge.icon}</div>
              <span className="font-medium text-foreground">{badge.label}</span>
            </div>
          ))}
        </div>

        <div 
          className={`mt-16 flex flex-wrap items-center justify-center gap-12 transition-all duration-700 ${
            isVisible ? "opacity-60" : "opacity-0"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <a 
            href="https://www.workana.com/freelancer/ba7ac8f9ffb8d2bc4f2d708dd5c2e897"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center group hover:opacity-100 transition-opacity"
          >
            <svg className="h-10 w-auto mx-auto text-muted group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              <path d="M12 5.5a1 1 0 011 1v5h3.5a1 1 0 110 2h-4.5a1 1 0 01-1-1v-6a1 1 0 011-1z"/>
            </svg>
            <span className="block text-sm text-muted group-hover:text-foreground mt-2 transition-colors">Workana</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/christian-mock-a5349515b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center group hover:opacity-100 transition-opacity"
          >
            <svg className="h-10 w-auto mx-auto text-muted group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="block text-sm text-muted group-hover:text-foreground mt-2 transition-colors">LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
}

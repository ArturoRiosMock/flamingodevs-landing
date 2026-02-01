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
        <svg className="h-8 w-8" viewBox="0 0 256 292" fill="currentColor">
          <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644 0 118.85 0c-37.54 0-55.494 46.983-61.12 70.857-14.67 4.53-25.09 7.771-26.34 8.148-8.13 2.556-8.388 2.808-9.442 10.413C21.055 95.554 0 256.893 0 256.893l175.898 32.987 95.136-21.103S223.975 58.8 223.774 57.34M156.99 40.848l-14.154 4.378c.002-.587.005-1.162.005-1.77 0-5.414-.748-9.803-1.958-13.406 8.102 1.065 12.811 10.185 16.107 20.798m-27.597-17.725c1.386 3.576 2.313 8.546 2.313 15.375 0 .908-.012 1.752-.03 2.553l-29.2 9.027c5.627-21.478 16.2-31.882 26.917-26.955M117.964 8.753c1.467 0 2.941.503 4.384 1.474-10.404 4.886-21.564 17.19-26.287 41.755l-22.596 6.99c6.353-21.875 20.089-50.22 44.5-50.22"/>
          <path d="M221.238 54.983c-1.056-.088-23.384-1.743-23.384-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.96-2.394-1.072l-2.353 230.824 95.136-21.103S223.975 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.536-2.357" fillOpacity=".15"/>
          <path d="M135.242 104.585l-11.016 32.748s-9.664-5.125-21.458-5.125c-17.341 0-18.196 10.881-18.196 13.625 0 14.958 38.999 20.697 38.999 55.744 0 27.574-17.485 45.317-41.078 45.317-28.31 0-42.776-17.619-42.776-17.619l7.573-25.017s14.906 12.798 27.478 12.798c8.215 0 11.563-6.47 11.563-11.198 0-19.537-31.988-20.41-31.988-52.449 0-27.001 19.39-53.138 58.519-53.138 15.08 0 22.38 4.314 22.38 4.314"/>
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

"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const portfolioImages = {
  ecommerce: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop",
  webapps: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  wordpress: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=450&fit=crop",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
};

const portfolioKeys = ["ecommerce", "webapps", "wordpress", "ai"] as const;

export default function Portfolio() {
  const t = useTranslations("portfolio");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="portfolio" className="py-24 bg-card">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioKeys.map((key, index) => (
            <div
              key={key}
              className={`group relative bg-background rounded-2xl overflow-hidden border border-border transition-all duration-700 ease-out hover:border-accent/50 hover:-translate-y-2 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500" />
              
              <div className="relative bg-background rounded-2xl overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={portfolioImages[key]}
                    alt={t(`items.${key}.title`)}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                  
                  {/* Overlay content on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 relative">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-muted mb-4 transition-colors duration-300 group-hover:text-foreground/70">
                    {t(`items.${key}.description`)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-mono bg-card px-3 py-1.5 rounded-full border border-border transition-all duration-300 group-hover:border-accent/30 group-hover:bg-accent/5">
                      {t(`items.${key}.stack`)}
                    </span>
                    <span className="text-sm text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                      {t("viewProject")}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

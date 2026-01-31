"use client";

import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function About() {
  const t = useTranslations("about");
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const skills = ["AI/ML", "Shopify", "WordPress", "Next.js", "Node.js", "PHP", "JavaScript", "GA4"];

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Card with animations */}
          <div 
            className={`relative transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="group aspect-square rounded-2xl bg-gradient-to-br from-[#212121]/20 via-muted/10 to-background border border-border overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  {/* Profile image with hover effect */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 group-hover:border-white/40 transition-all duration-500 group-hover:scale-105">
                      <img
                        src="/christian-rios.png"
                        alt="Christian Rios"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground transition-transform duration-300 group-hover:scale-105">
                    {t("name")}
                  </h3>
                  <p className="text-muted mt-1">{t("role")}</p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted">
                    <svg className="h-4 w-4 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    {t("location")}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Animated decorative elements */}
            <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-[#212121]/10 rounded-full blur-2xl transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} style={{ transitionDelay: "300ms" }} />
            <div className={`absolute -top-6 -left-6 w-24 h-24 bg-muted/10 rounded-full blur-2xl transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} style={{ transitionDelay: "500ms" }} />
          </div>

          {/* Content with stagger animations */}
          <div>
            <h2 
              className={`text-3xl md:text-4xl font-bold text-foreground mb-6 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {t("title")}
            </h2>
            <p 
              className={`text-lg text-muted leading-relaxed mb-6 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {t("bio")}
            </p>
            <p 
              className={`text-lg text-muted leading-relaxed mb-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              {t("bio2")}
            </p>

            {/* Skills with stagger animation */}
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={skill}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-card border border-border text-foreground transition-all duration-500 hover:scale-105 hover:border-accent/50 hover:shadow-md cursor-default ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

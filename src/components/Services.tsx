"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const serviceIcons = {
  ai: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  shopify: (
    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 256 292">
      <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644 0 118.85 0c-37.54 0-55.494 46.983-61.12 70.857-14.67 4.53-25.09 7.771-26.34 8.148-8.13 2.556-8.388 2.808-9.442 10.413C21.055 95.554 0 256.893 0 256.893l175.898 32.987 95.136-21.103S223.975 58.8 223.774 57.34M156.99 40.848l-14.154 4.378c.002-.587.005-1.162.005-1.77 0-5.414-.748-9.803-1.958-13.406 8.102 1.065 12.811 10.185 16.107 20.798m-27.597-17.725c1.386 3.576 2.313 8.546 2.313 15.375 0 .908-.012 1.752-.03 2.553l-29.2 9.027c5.627-21.478 16.2-31.882 26.917-26.955M117.964 8.753c1.467 0 2.941.503 4.384 1.474-10.404 4.886-21.564 17.19-26.287 41.755l-22.596 6.99c6.353-21.875 20.089-50.22 44.5-50.22"/>
      <path d="M221.238 54.983c-1.056-.088-23.384-1.743-23.384-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.96-2.394-1.072l-2.353 230.824 95.136-21.103S223.975 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.536-2.357" fillOpacity=".15"/>
      <path d="M135.242 104.585l-11.016 32.748s-9.664-5.125-21.458-5.125c-17.341 0-18.196 10.881-18.196 13.625 0 14.958 38.999 20.697 38.999 55.744 0 27.574-17.485 45.317-41.078 45.317-28.31 0-42.776-17.619-42.776-17.619l7.573-25.017s14.906 12.798 27.478 12.798c8.215 0 11.563-6.47 11.563-11.198 0-19.537-31.988-20.41-31.988-52.449 0-27.001 19.39-53.138 58.519-53.138 15.08 0 22.38 4.314 22.38 4.314"/>
    </svg>
  ),
  wordpress: (
    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 256 255">
      <path d="M18.124 127.5c0 43.296 25.16 80.711 61.646 98.442L27.594 82.986a108.965 108.965 0 0 0-9.47 44.514m183.221-5.52c0-13.517-4.856-22.879-9.02-30.165-5.545-9.01-10.742-16.64-10.742-25.65 0-10.055 7.626-19.415 18.368-19.415.485 0 .944.06 1.417.088-19.46-17.829-45.387-28.714-73.863-28.714-38.213 0-71.832 19.606-91.39 49.302 2.566.077 4.984.13 7.039.13 11.44 0 29.151-1.387 29.151-1.387 5.897-.347 6.592 8.312.702 9.01 0 0-5.926.697-12.52 1.042l39.832 118.481 23.94-71.749-17.03-46.732c-5.89-.345-11.47-1.042-11.47-1.042-5.894-.346-5.203-9.358.691-9.01 0 0 18.064 1.386 28.811 1.386 11.44 0 29.151-1.386 29.151-1.386 5.9-.347 6.593 8.312.702 9.01 0 0-5.938.697-12.52 1.042l39.529 117.581 10.91-36.458c4.728-15.129 8.327-25.995 8.327-35.36"/>
      <path d="M129.735 137.095l-32.832 95.39c9.812 2.885 20.173 4.457 30.896 4.457 12.733 0 24.94-2.2 36.291-6.194-.29-.467-.556-.958-.779-1.502l-33.576-92.15m88.683-59.533c.472 3.496.737 7.253.737 11.303 0 11.153-2.083 23.684-8.333 39.351l-33.483 96.85c32.594-19.012 54.548-54.326 54.548-94.915 0-19.092-4.857-37.044-13.469-52.59"/>
      <path d="M127.505 0C57.2 0 0 57.196 0 127.5c0 70.313 57.2 127.507 127.505 127.507 70.302 0 127.51-57.194 127.51-127.507C255.015 57.196 197.808 0 127.506 0m0 249.163c-67.08 0-121.659-54.578-121.659-121.663 0-67.08 54.576-121.654 121.659-121.654 67.078 0 121.652 54.574 121.652 121.654 0 67.085-54.574 121.663-121.652 121.663"/>
    </svg>
  ),
  nextjs: (
    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 256 256">
      <path d="M119.617.069c-.55.05-2.302.225-3.879.35-36.36 3.278-70.419 22.894-91.99 53.044-12.012 16.764-19.694 35.78-22.597 55.922C.125 116.415 0 118.492 0 128.025c0 9.533.125 11.61 1.151 18.64 6.957 48.065 41.165 88.449 87.56 103.411 8.309 2.678 17.067 4.504 27.027 5.605 3.879.425 20.645.425 24.524 0 17.192-1.902 31.756-6.155 46.12-13.486 2.202-1.126 2.628-1.426 2.327-1.677-.2-.15-9.584-12.735-20.845-27.948l-20.47-27.648-25.65-37.956c-14.114-20.868-25.725-37.932-25.825-37.932-.1-.025-.2 16.84-.25 37.431-.076 36.055-.1 37.506-.551 38.357-.65 1.226-1.151 1.727-2.202 2.277-.801.4-1.502.475-5.28.475h-4.33l-1.15-.725a4.679 4.679 0 0 1-1.677-1.827l-.526-1.126.05-50.166.076-50.191.777-.976c.4-.525 1.251-1.2 1.852-1.526 1.026-.5 1.426-.55 5.755-.55 5.105 0 5.956.2 7.282 1.651.376.4 14.264 21.318 30.88 46.514 16.617 25.195 39.34 59.599 50.5 76.488l20.27 30.7 1.026-.675c9.084-5.905 18.693-14.312 26.3-23.07 16.191-18.59 26.626-41.258 30.13-65.428 1.026-7.03 1.151-9.107 1.151-18.64 0-9.533-.125-11.61-1.151-18.64-6.957-48.065-41.165-88.449-87.56-103.411-8.184-2.652-16.892-4.479-26.652-5.58-2.402-.25-18.943-.525-21.02-.325m52.401 77.414c1.201.6 2.177 1.752 2.527 2.953.2.65.25 14.562.2 45.913l-.074 44.987-7.933-12.16-7.958-12.16v-32.702c0-21.143.1-33.028.25-33.603.4-1.401 1.277-2.502 2.478-3.153 1.026-.525 1.401-.575 5.33-.575 3.704 0 4.354.05 5.18.5"/>
    </svg>
  ),
  analytics: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  fullstack: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
};

interface ServiceCardProps {
  serviceKey: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  isLarge?: boolean;
  isVisible: boolean;
}

function ServiceCard({ title, description, icon, index, isLarge, isVisible }: ServiceCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-card p-8 transition-all duration-700 ease-out ${
        isLarge ? "md:col-span-2 md:row-span-2" : ""
      } ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm" />
        <div className="absolute inset-[1px] rounded-2xl bg-card" />
      </div>

      {/* Static border */}
      <div className="absolute inset-0 rounded-2xl border border-border group-hover:border-transparent transition-colors duration-500" />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center rounded-xl bg-background border border-border text-foreground/80 group-hover:text-foreground group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300 ${
          isLarge ? "w-16 h-16 mb-6" : "w-14 h-14 mb-5"
        }`}>
          {icon}
        </div>
        <h3 className={`font-semibold text-foreground mb-3 ${isLarge ? "text-2xl" : "text-lg"}`}>
          {title}
        </h3>
        <p className={`text-muted leading-relaxed group-hover:text-foreground/80 transition-colors duration-300 ${
          isLarge ? "text-base" : "text-sm"
        }`}>
          {description}
        </p>
      </div>
    </div>
  );
}

const serviceKeys = ["shopify", "ai", "wordpress", "nextjs", "analytics", "fullstack"] as const;

export default function Services() {
  const t = useTranslations("services");
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
    <section ref={sectionRef} id="services" className="py-24 bg-background">
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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Large card - Shopify */}
          <ServiceCard
            serviceKey="shopify"
            title={t("items.shopify.title")}
            description={t("items.shopify.description")}
            icon={serviceIcons.shopify}
            index={0}
            isLarge={true}
            isVisible={isVisible}
          />

          {/* Small cards - AI & WordPress */}
          <ServiceCard
            serviceKey="ai"
            title={t("items.ai.title")}
            description={t("items.ai.description")}
            icon={serviceIcons.ai}
            index={1}
            isVisible={isVisible}
          />
          <ServiceCard
            serviceKey="wordpress"
            title={t("items.wordpress.title")}
            description={t("items.wordpress.description")}
            icon={serviceIcons.wordpress}
            index={2}
            isVisible={isVisible}
          />

          {/* Bottom row - 3 small cards */}
          <ServiceCard
            serviceKey="nextjs"
            title={t("items.nextjs.title")}
            description={t("items.nextjs.description")}
            icon={serviceIcons.nextjs}
            index={3}
            isVisible={isVisible}
          />
          <ServiceCard
            serviceKey="analytics"
            title={t("items.analytics.title")}
            description={t("items.analytics.description")}
            icon={serviceIcons.analytics}
            index={4}
            isVisible={isVisible}
          />
          <ServiceCard
            serviceKey="fullstack"
            title={t("items.fullstack.title")}
            description={t("items.fullstack.description")}
            icon={serviceIcons.fullstack}
            index={5}
            isVisible={isVisible}
          />
        </div>
      </div>
    </section>
  );
}

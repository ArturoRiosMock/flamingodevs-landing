"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ShaderBackground = dynamic(() => import("./ShaderBackground"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-card" />
  ),
});

export default function Hero() {
  const t = useTranslations("hero");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <ShaderBackground />

      <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
        {/* Badge with stagger animation */}
        <div 
          className={`inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm text-white/80 mb-8 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          AI Consultant & Full Stack Developer
        </div>

        {/* Headline with dramatic entrance */}
        <h1 
          className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-lg transition-all duration-1000 ease-out ${
            mounted ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {t("headline")}
        </h1>

        {/* Subheadline */}
        <p 
          className={`mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          {t("subheadline")}
        </p>

        {/* CTA Button with magnetic hover effect */}
        <div 
          className={`mt-10 flex items-center justify-center transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-semibold text-[#212121] transition-all duration-300 hover:scale-105 shadow-lg shadow-black/20 overflow-hidden"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative flex items-center">
              {t("cta")}
              <svg
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* Partner badges with stagger animation */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {/* Shopify Partner */}
          <div 
            className={`group flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:border-white/40 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <svg className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 256 292" fill="white">
              <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644 0 118.85 0c-37.54 0-55.494 46.983-61.12 70.857-14.67 4.53-25.09 7.771-26.34 8.148-8.13 2.556-8.388 2.808-9.442 10.413C21.055 95.554 0 256.893 0 256.893l175.898 32.987 95.136-21.103S223.975 58.8 223.774 57.34M156.99 40.848l-14.154 4.378c.002-.587.005-1.162.005-1.77 0-5.414-.748-9.803-1.958-13.406 8.102 1.065 12.811 10.185 16.107 20.798m-27.597-17.725c1.386 3.576 2.313 8.546 2.313 15.375 0 .908-.012 1.752-.03 2.553l-29.2 9.027c5.627-21.478 16.2-31.882 26.917-26.955M117.964 8.753c1.467 0 2.941.503 4.384 1.474-10.404 4.886-21.564 17.19-26.287 41.755l-22.596 6.99c6.353-21.875 20.089-50.22 44.5-50.22"/>
              <path d="M221.238 54.983c-1.056-.088-23.384-1.743-23.384-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.96-2.394-1.072l-2.353 230.824 95.136-21.103S223.975 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.536-2.357" fillOpacity=".15"/>
              <path d="M135.242 104.585l-11.016 32.748s-9.664-5.125-21.458-5.125c-17.341 0-18.196 10.881-18.196 13.625 0 14.958 38.999 20.697 38.999 55.744 0 27.574-17.485 45.317-41.078 45.317-28.31 0-42.776-17.619-42.776-17.619l7.573-25.017s14.906 12.798 27.478 12.798c8.215 0 11.563-6.47 11.563-11.198 0-19.537-31.988-20.41-31.988-52.449 0-27.001 19.39-53.138 58.519-53.138 15.08 0 22.38 4.314 22.38 4.314"/>
            </svg>
            <span className="text-sm font-medium text-white">Shopify Partner</span>
          </div>

          {/* WordPress Expert */}
          <div 
            className={`group flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:border-white/40 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "1100ms" }}
          >
            <svg className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 122.52 122.523" fill="white">
              <path d="M8.708 61.26c0 20.802 12.089 38.779 29.619 47.298L13.258 39.872a52.354 52.354 0 0 0-4.55 21.388zm88.032-2.652c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501L48.2 93.547l11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z"/>
              <path d="M62.184 65.857l-15.768 45.819a52.552 52.552 0 0 0 32.268-.838 4.661 4.661 0 0 1-.37-.702L62.184 65.857zm45.936-29.879a42.066 42.066 0 0 1 .332 5.594c0 5.52-1.034 11.724-4.132 19.485L88.27 106.53c15.406-8.982 25.756-25.78 25.756-44.972-.001-9.189-2.408-17.833-6.637-25.316z"/>
              <path d="M61.262 0C27.483 0 0 27.481 0 61.26c0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263C122.526 27.481 95.04 0 61.262 0zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z"/>
            </svg>
            <span className="text-sm font-medium text-white">WordPress Expert</span>
          </div>

          {/* Next.js Specialist */}
          <div 
            className={`group flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:border-white/40 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            <svg className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 180 180" fill="white">
              <mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                <circle cx="90" cy="90" r="90" fill="white"/>
              </mask>
              <g mask="url(#mask0)">
                <circle cx="90" cy="90" r="90" fill="black"/>
                <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.3833L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear)"/>
                <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear)"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="text-sm font-medium text-white">Next.js Specialist</span>
          </div>
        </div>
      </div>
    </section>
  );
}

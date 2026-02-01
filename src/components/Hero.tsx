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
            <svg className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 109 124" fill="white">
              <path d="M74.7 14.8c0-.1-.1-.2-.2-.2-.1 0-2.5-.5-2.5-.5s-1.7-1.7-1.9-1.9c-.2-.2-.5-.1-.7-.1 0 0-.4.1-1 .3-.6-1.7-1.6-3.3-3.4-3.3h-.2c-.5-.6-1.1-1-1.7-1-4.3 0-6.3 5.3-6.9 8-.6.2-1.3.4-2 .6-.6.2-1-.3-1-.3-.1-.1-.2-.2-.4-.1l-1.7.5s-.2 0-.2.2c-.2.6-3.5 27.2-3.5 27.2l26.3 4.9 14.2-3.1c0-.1-14.2-30.6-14.2-31.2zM66 17.6c-.7.2-1.4.4-2.2.7V17c0-1.3-.2-2.3-.5-3.1 1.2.2 2 1.5 2.7 3.7zm-4.4-3.2c.3.8.6 2 .6 3.5v.4c-1.4.5-3 .9-4.6 1.4.9-3.4 2.6-5.1 4-5.3zm-2.4-1.9c.3 0 .5.1.8.3-1.9.9-4 3.2-4.8 7.7-1.2.4-2.4.7-3.5 1.1 1-3.3 3.2-9.1 7.5-9.1z"/>
              <path d="M74.5 14.6c-.1 0-2.5-.5-2.5-.5s-1.7-1.7-1.9-1.9c-.1-.1-.2-.1-.3-.1l-2 43.1 14.2-3.1S67.7 21 67.7 20.4c0-.5-3-5.8-3-5.8l9.8 37.6z"/>
              <path fillOpacity=".5" d="M62.6 47.5l-3.2 9.5s-1.4-.8-3.1-.8c-2.5 0-2.6 1.6-2.6 2 0 2.1 5.6 2.9 5.6 8 0 3.9-2.5 6.5-5.9 6.5-4.1 0-6.1-2.5-6.1-2.5l1.1-3.6s2.1 1.8 3.9 1.8c1.2 0 1.7-.9 1.7-1.6 0-2.8-4.6-2.9-4.6-7.5 0-3.9 2.8-7.6 8.4-7.6 2.2-.1 3.8.6 3.8.6"/>
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

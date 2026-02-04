"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

// Servicios por país (sin locale, se agrega dinámicamente)
const servicesByCountry = [
  {
    country: "Venezuela",
    flag: "🇻🇪",
    path: "/servicios-venezuela",
    description: "Catálogos, E-commerce y Automatización",
  },
  // Agregar más países aquí en el futuro
  // {
  //   country: "Colombia",
  //   flag: "🇨🇴",
  //   path: "/servicios-colombia",
  //   description: "Próximamente",
  // },
];

// Herramientas disponibles
const toolsList = [
  {
    name: "Analizador Web",
    path: "/herramientas/analizador-web",
    description: "Analiza velocidad, SEO y accesibilidad",
    icon: "chart",
    available: true,
  },
  {
    name: "Detector de Tecnologías",
    path: "/herramientas/detector-tecnologias",
    description: "Descubre qué tecnologías usa un sitio",
    icon: "search",
    available: true,
  },
  {
    name: "Auditor de Tiendas",
    path: "/herramientas/auditor-tiendas",
    description: "Detecta problemas de conversión en tu tienda",
    icon: "store",
    available: true,
  },
  {
    name: "Generador Meta Tags",
    path: "/herramientas/meta-tags",
    description: "Genera meta tags para SEO",
    icon: "code",
    available: false,
  },
  {
    name: "Conversor de Imágenes",
    path: "/herramientas/conversor-imagenes",
    description: "Convierte PNG, JPG, WebP",
    icon: "image",
    available: false,
  },
];

// Pages with light background (no dark hero)
const pagesWithLightBackground = [
  "/blog",
  "/herramientas",
];

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  // Check if current page has a light background (no dark hero)
  const hasLightBackground = pagesWithLightBackground.some(path => 
    pathname.includes(path)
  );

  // Use dark text when on light background OR when scrolled
  const useDarkText = scrolled || hasLightBackground;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: `/${locale}#about`, label: t("about") },
    { href: `/${locale}/blog`, label: "Blog" },
    { href: `/${locale}#contact`, label: t("contact") },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-background/95 backdrop-blur-md shadow-sm" 
            : hasLightBackground 
              ? "bg-background/80 backdrop-blur-sm"
              : "bg-transparent"
        } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
      >
        <nav className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="group flex items-center gap-2"
            >
              <span className={`text-xl font-bold transition-all duration-300 ${useDarkText ? "text-foreground" : "text-white"}`}>
                Flamingo<span className="text-muted group-hover:text-accent transition-colors">Devs</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {/* Mega Menu - Servicios */}
              <div 
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  className={`relative text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                    useDarkText 
                      ? "text-muted hover:text-foreground" 
                      : "text-white/70 hover:text-white"
                  } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                  style={{ transitionDelay: "50ms" }}
                >
                  <span>{t("services")}</span>
                  <svg 
                    className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${
                    servicesOpen 
                      ? "opacity-100 translate-y-0 pointer-events-auto" 
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="bg-background/95 backdrop-blur-md rounded-2xl border border-border shadow-xl p-2 min-w-[280px]">
                    {/* Link a servicios generales */}
                    <Link
                      href={`/${locale}#services`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Todos los Servicios</p>
                        <p className="text-xs text-muted">IA, Shopify, WordPress, Next.js</p>
                      </div>
                    </Link>

                    {/* Separator */}
                    <div className="h-px bg-border my-2" />

                    {/* Servicios por país */}
                    <p className="px-4 py-2 text-xs font-medium text-muted uppercase tracking-wider">
                      Por País
                    </p>
                    
                    {servicesByCountry.map((service) => (
                      <Link
                        key={service.path}
                        href={`/${locale}${service.path}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center text-2xl group-hover:bg-muted/30 transition-colors">
                          {service.flag}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{service.country}</p>
                          <p className="text-xs text-muted">{service.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mega Menu - Herramientas */}
              <div 
                className="relative"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                <button
                  className={`relative text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                    useDarkText 
                      ? "text-muted hover:text-foreground" 
                      : "text-white/70 hover:text-white"
                  } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                  style={{ transitionDelay: "100ms" }}
                >
                  <span>{t("tools")}</span>
                  <svg 
                    className={`h-4 w-4 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${
                    toolsOpen 
                      ? "opacity-100 translate-y-0 pointer-events-auto" 
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="bg-background/95 backdrop-blur-md rounded-2xl border border-border shadow-xl p-2 min-w-[280px]">
                    {/* Link a todas las herramientas */}
                    <Link
                      href={`/${locale}/herramientas`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Todas las Herramientas</p>
                        <p className="text-xs text-muted">Herramientas gratuitas para tu web</p>
                      </div>
                    </Link>

                    {/* Separator */}
                    <div className="h-px bg-border my-2" />

                    {/* Herramientas disponibles */}
                    <p className="px-4 py-2 text-xs font-medium text-muted uppercase tracking-wider">
                      Herramientas
                    </p>
                    
                    {toolsList.map((tool) => (
                      <Link
                        key={tool.path}
                        href={tool.available ? `/${locale}${tool.path}` : `/${locale}/herramientas`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/10 transition-colors group ${!tool.available ? "opacity-60" : ""}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center group-hover:bg-muted/30 transition-colors">
                          {tool.icon === "chart" && (
                            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                          )}
                          {tool.icon === "search" && (
                            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                          )}
                          {tool.icon === "store" && (
                            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                            </svg>
                          )}
                          {tool.icon === "code" && (
                            <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                            </svg>
                          )}
                          {tool.icon === "image" && (
                            <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground flex items-center gap-2">
                            {tool.name}
                            {!tool.available && (
                              <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-muted/20 text-muted">Pronto</span>
                            )}
                          </p>
                          <p className="text-xs text-muted">{tool.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regular Nav Links */}
              {navLinks.map((link, index) => {
                const isInternalRoute = link.href.startsWith('/');
                const Component = isInternalRoute ? Link : 'a';
                return (
                  <Component
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium transition-all duration-300 ${
                      useDarkText 
                        ? "text-muted hover:text-foreground" 
                        : "text-white/70 hover:text-white"
                    } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                    style={{ transitionDelay: `${(index + 2) * 50}ms` }}
                  >
                    <span className="relative">
                      {link.label}
                      <span className={`absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 ${
                        useDarkText ? "bg-foreground" : "bg-white"
                      } group-hover:w-full`} />
                    </span>
                  </Component>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className={useDarkText ? "" : "[&_button]:text-white/70 [&_button]:hover:text-white"}>
                <LanguageSwitcher />
              </div>
              <Link
                href={`/${locale}#contact`}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
                  useDarkText
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-white text-gray-900 hover:bg-white/90"
                }`}
              >
                {t("hireCta")}
              </Link>
            </div>

            <button
              type="button"
              className={`md:hidden p-2 transition-colors z-50 ${
                useDarkText ? "text-muted hover:text-foreground" : "text-white/70 hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <span className="text-xl font-bold text-foreground">
              Flamingo<span className="text-muted">Devs</span>
            </span>
            <button
              type="button"
              className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-muted/10"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {/* Servicios con submenu */}
              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-lg font-medium text-foreground hover:bg-muted/10 rounded-xl transition-all duration-300 ${
                    mobileMenuOpen 
                      ? "translate-x-0 opacity-100" 
                      : "translate-x-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "150ms" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent/50" />
                    {t("services")}
                  </div>
                  <svg 
                    className={`h-5 w-5 text-muted transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Submenu */}
                <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="pl-6 pt-2 space-y-1">
                    <Link
                      href={`/${locale}#services`}
                      className="flex items-center gap-3 px-4 py-2.5 text-base text-muted hover:text-foreground hover:bg-muted/10 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                      </svg>
                      Todos los Servicios
                    </Link>
                    
                    <p className="px-4 py-2 text-xs font-medium text-muted/70 uppercase tracking-wider">
                      Por País
                    </p>
                    
                    {servicesByCountry.map((service) => (
                      <Link
                        key={service.path}
                        href={`/${locale}${service.path}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-base text-muted hover:text-foreground hover:bg-muted/10 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-lg">{service.flag}</span>
                        {service.country}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Herramientas con submenu */}
              <div>
                <button
                  onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-lg font-medium text-foreground hover:bg-muted/10 rounded-xl transition-all duration-300 ${
                    mobileMenuOpen 
                      ? "translate-x-0 opacity-100" 
                      : "translate-x-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent/50" />
                    {t("tools")}
                  </div>
                  <svg 
                    className={`h-5 w-5 text-muted transition-transform duration-200 ${mobileToolsOpen ? "rotate-180" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Submenu Herramientas */}
                <div className={`overflow-hidden transition-all duration-300 ${mobileToolsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="pl-6 pt-2 space-y-1">
                    <Link
                      href={`/${locale}/herramientas`}
                      className="flex items-center gap-3 px-4 py-2.5 text-base text-muted hover:text-foreground hover:bg-muted/10 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                      </svg>
                      Todas las Herramientas
                    </Link>
                    
                    {toolsList.map((tool) => (
                      <Link
                        key={tool.path}
                        href={tool.available ? `/${locale}${tool.path}` : `/${locale}/herramientas`}
                        className={`flex items-center gap-3 px-4 py-2.5 text-base text-muted hover:text-foreground hover:bg-muted/10 rounded-lg transition-colors ${!tool.available ? "opacity-60" : ""}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {tool.icon === "chart" && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
                          </svg>
                        )}
                        {tool.icon === "search" && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                        )}
                        {tool.icon === "store" && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                          </svg>
                        )}
                        {tool.icon === "code" && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                          </svg>
                        )}
                        {tool.icon === "image" && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        )}
                        <span className="flex items-center gap-2">
                          {tool.name}
                          {!tool.available && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/20">Pronto</span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Other nav links */}
              {navLinks.map((link, index) => {
                const isInternalRoute = link.href.startsWith('/');
                const Component = isInternalRoute ? Link : 'a';
                return (
                  <Component
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 text-lg font-medium text-foreground hover:bg-muted/10 rounded-xl transition-all duration-300 ${
                      mobileMenuOpen 
                        ? "translate-x-0 opacity-100" 
                        : "translate-x-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${200 + index * 50}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="w-2 h-2 rounded-full bg-accent/50" />
                    {link.label}
                  </Component>
                );
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-center justify-center">
              <LanguageSwitcher />
            </div>
            <Link
              href={`/${locale}#contact`}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-foreground text-background px-6 py-3 text-base font-medium transition-all hover:bg-foreground/90 hover:scale-[1.02]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("hireCta")}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            
            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <a
                href="https://github.com/ArturoRiosMock"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/christian-mock-a5349515b/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

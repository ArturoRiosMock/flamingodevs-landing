"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
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

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

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
            : "bg-transparent"
        } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
      >
        <nav className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="group flex items-center gap-2"
            >
              <span className={`text-xl font-bold transition-all duration-300 ${scrolled ? "text-foreground" : "text-white"}`}>
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
                    scrolled 
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

              {/* Regular Nav Links */}
              {navLinks.map((link, index) => {
                const isInternalRoute = link.href.startsWith('/');
                const Component = isInternalRoute ? Link : 'a';
                return (
                  <Component
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium transition-all duration-300 ${
                      scrolled 
                        ? "text-muted hover:text-foreground" 
                        : "text-white/70 hover:text-white"
                    } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                    style={{ transitionDelay: `${(index + 2) * 50}ms` }}
                  >
                    <span className="relative">
                      {link.label}
                      <span className={`absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 ${
                        scrolled ? "bg-foreground" : "bg-white"
                      } group-hover:w-full`} />
                    </span>
                  </Component>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className={scrolled ? "" : "[&_button]:text-white/70 [&_button]:hover:text-white"}>
                <LanguageSwitcher />
              </div>
              <Link
                href={`/${locale}#contact`}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
                  scrolled
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
                scrolled ? "text-muted hover:text-foreground" : "text-white/70 hover:text-white"
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

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("header");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: t("services") },
    { href: "#about", label: t("about") },
    { href: "#portfolio", label: t("portfolio") },
    { href: "#contact", label: t("contact") },
  ];

  return (
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
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-all duration-300 ${
                  scrolled 
                    ? "text-muted hover:text-foreground" 
                    : "text-white/70 hover:text-white"
                } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                style={{ transitionDelay: `${(index + 1) * 50}ms` }}
              >
                <span className="relative">
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 ${
                    scrolled ? "bg-foreground" : "bg-white"
                  } group-hover:w-full`} />
                </span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className={scrolled ? "" : "[&_button]:text-white/70 [&_button]:hover:text-white"}>
              <LanguageSwitcher />
            </div>
            <a
              href="https://calendly.com/mockraw/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
                scrolled
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-white text-gray-900 hover:bg-white/90"
              }`}
            >
              {t("hireCta")}
            </a>
          </div>

          <button
            type="button"
            className={`md:hidden p-2 transition-colors ${
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

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    scrolled 
                      ? "text-muted hover:text-foreground" 
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-2">
                <LanguageSwitcher />
                <a
                  href="https://calendly.com/mockraw/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                    scrolled
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-white text-gray-900 hover:bg-white/90"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("hireCta")}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

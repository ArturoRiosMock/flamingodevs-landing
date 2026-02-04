"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Testimonials from "@/components/Testimonials";

const WHATSAPP_URL = "https://wa.me/5548980685138?text=Hola%2C%20vengo%20de%20tu%20web%20de%20Venezuela%20y%20me%20interesa%20";

// Icons
const CheckIcon = () => (
  <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const MessageIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

const InventoryIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

const CentralIcon = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>
);

const ProfessionalIcon = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const AutomationIcon = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CatalogIcon = () => (
  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const ShopIcon = () => (
  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const RocketIcon = () => (
  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

interface PackCardProps {
  name: string;
  tagline: string;
  idealFor: string;
  painSolved: string;
  priceFrom: string;
  priceTo: string;
  deliveryDays: string;
  maintenancePrice: string;
  features: string[];
  icon: React.ReactNode;
  isPopular?: boolean;
  packNumber: number;
  t: ReturnType<typeof useTranslations>;
}

function PackCard({ 
  name, tagline, idealFor, painSolved, priceFrom, priceTo, 
  deliveryDays, maintenancePrice, features, icon, isPopular, packNumber, t 
}: PackCardProps) {
  const whatsappMessage = encodeURIComponent(`el Pack ${packNumber}: ${name}`);
  
  return (
    <div className={`relative flex flex-col rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${
      isPopular 
        ? "bg-gradient-to-b from-accent/10 to-background border-accent/50 shadow-lg shadow-accent/10" 
        : "bg-card border-border hover:border-accent/30"
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-accent text-background text-sm font-medium px-4 py-1 rounded-full">
            {t("packs.popular")}
          </span>
        </div>
      )}
      
      <div className="p-6 md:p-8 flex-1">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl ${isPopular ? "bg-accent/20 text-accent" : "bg-muted/50 text-foreground"}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{name}</h3>
            <p className="text-sm text-accent font-medium">{tagline}</p>
          </div>
        </div>
        
        {/* Ideal for */}
        <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted uppercase tracking-wide mb-1">Ideal para:</p>
          <p className="text-sm text-foreground font-medium">{idealFor}</p>
        </div>
        
        {/* Pain solved */}
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-400 uppercase tracking-wide mb-1">Dolor que resuelve:</p>
          <p className="text-sm text-foreground italic">&quot;{painSolved}&quot;</p>
        </div>
        
        {/* Price */}
        <div className="mb-6">
          <p className="text-xs text-muted uppercase tracking-wide mb-1">{t("packs.setupFee")}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-bold text-foreground">${priceFrom}</span>
            <span className="text-xl text-muted">- ${priceTo}</span>
            <span className="text-sm text-muted">USD</span>
          </div>
        </div>
        
        {/* Delivery & Maintenance */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-muted/20 text-center">
            <p className="text-xs text-muted uppercase tracking-wide">{t("packs.delivery")}</p>
            <p className="text-lg font-semibold text-foreground">{deliveryDays} {t("packs.days")}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 text-center">
            <p className="text-xs text-muted uppercase tracking-wide">{t("packs.maintenance")}</p>
            <p className="text-lg font-semibold text-foreground">${maintenancePrice}/{t("packs.month")}</p>
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">{t("packs.includes")}:</p>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted">
                <CheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* CTA Button */}
      <div className="p-6 pt-0">
        <a
          href={`${WHATSAPP_URL}${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-all hover:scale-105 ${
            isPopular 
              ? "bg-accent text-background hover:bg-accent/90" 
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          <WhatsAppIcon />
          {t("packs.cta")}
        </a>
      </div>
    </div>
  );
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ServiciosVenezuelaPage() {
  const t = useTranslations("venezuelaServices");

  const problems = [
    { icon: <MessageIcon />, key: "messages" },
    { icon: <InstagramIcon />, key: "instagram" },
    { icon: <InventoryIcon />, key: "inventory" },
    { icon: <PaymentIcon />, key: "payments" },
  ];

  const valueProps = [
    { icon: <CentralIcon />, key: "centralization" },
    { icon: <ProfessionalIcon />, key: "professionalism" },
    { icon: <SecurityIcon />, key: "security" },
    { icon: <AutomationIcon />, key: "automation" },
  ];

  const processSteps = ["step1", "step2", "step3", "step4", "step5"];

  const faqs = ["q1", "q2", "q3", "q4", "q5"];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              {t("hero.badge")}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {t("hero.title")}
              <br />
              <span className="text-accent">{t("hero.titleHighlight")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-10">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#packs"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background transition-all hover:scale-105 hover:bg-foreground/90"
              >
                {t("hero.cta")}
              </a>
              <a
                href={`${WHATSAPP_URL}información`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-green-700"
              >
                <WhatsAppIcon />
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("problems.title")}
            </h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, idx) => (
              <AnimatedSection key={problem.key} delay={idx * 100}>
                <div className="group p-6 rounded-2xl bg-background border border-border hover:border-red-500/30 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {problem.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`problems.items.${problem.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted">
                    {t(`problems.items.${problem.key}.description`)}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Packs Section */}
      <section id="packs" className="py-20 bg-background scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("packs.title")}
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {t("packs.subtitle")}
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection delay={0}>
              <PackCard
                name={t("packs.pack1.name")}
                tagline={t("packs.pack1.tagline")}
                idealFor={t("packs.pack1.idealFor")}
                painSolved={t("packs.pack1.painSolved")}
                priceFrom={t("packs.pack1.priceFrom")}
                priceTo={t("packs.pack1.priceTo")}
                deliveryDays={t("packs.pack1.deliveryDays")}
                maintenancePrice={t("packs.pack1.maintenancePrice")}
                features={[
                  t("packs.pack1.features.0"),
                  t("packs.pack1.features.1"),
                  t("packs.pack1.features.2"),
                  t("packs.pack1.features.3"),
                  t("packs.pack1.features.4"),
                  t("packs.pack1.features.5"),
                ]}
                icon={<CatalogIcon />}
                packNumber={1}
                t={t}
              />
            </AnimatedSection>
            
            <AnimatedSection delay={100}>
              <PackCard
                name={t("packs.pack2.name")}
                tagline={t("packs.pack2.tagline")}
                idealFor={t("packs.pack2.idealFor")}
                painSolved={t("packs.pack2.painSolved")}
                priceFrom={t("packs.pack2.priceFrom")}
                priceTo={t("packs.pack2.priceTo")}
                deliveryDays={t("packs.pack2.deliveryDays")}
                maintenancePrice={t("packs.pack2.maintenancePrice")}
                features={[
                  t("packs.pack2.features.0"),
                  t("packs.pack2.features.1"),
                  t("packs.pack2.features.2"),
                  t("packs.pack2.features.3"),
                  t("packs.pack2.features.4"),
                  t("packs.pack2.features.5"),
                  t("packs.pack2.features.6"),
                ]}
                icon={<ShopIcon />}
                isPopular={true}
                packNumber={2}
                t={t}
              />
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <PackCard
                name={t("packs.pack3.name")}
                tagline={t("packs.pack3.tagline")}
                idealFor={t("packs.pack3.idealFor")}
                painSolved={t("packs.pack3.painSolved")}
                priceFrom={t("packs.pack3.priceFrom")}
                priceTo={t("packs.pack3.priceTo")}
                deliveryDays={t("packs.pack3.deliveryDays")}
                maintenancePrice={t("packs.pack3.maintenancePrice")}
                features={[
                  t("packs.pack3.features.0"),
                  t("packs.pack3.features.1"),
                  t("packs.pack3.features.2"),
                  t("packs.pack3.features.3"),
                  t("packs.pack3.features.4"),
                  t("packs.pack3.features.5"),
                  t("packs.pack3.features.6"),
                ]}
                icon={<RocketIcon />}
                packNumber={3}
                t={t}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Value Proposition Section */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("value.title")}
            </h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueProps.map((prop, idx) => (
              <AnimatedSection key={prop.key} delay={idx * 100}>
                <div className="group flex gap-5 p-6 rounded-2xl bg-background border border-border hover:border-accent/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    {prop.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {t(`value.items.${prop.key}.title`)}
                    </h3>
                    <p className="text-muted">
                      {t(`value.items.${prop.key}.description`)}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("process.title")}
            </h2>
            <p className="text-lg text-muted">
              {t("process.subtitle")}
            </p>
          </AnimatedSection>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            
            <div className="space-y-8 md:space-y-0">
              {processSteps.map((step, idx) => (
                <AnimatedSection key={step} delay={idx * 100}>
                  <div className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}>
                    <div className={`flex-1 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className={`inline-block p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all ${
                        idx % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                      }`}>
                        <span className="text-sm font-medium text-accent">
                          {t(`process.steps.${step}.day`)}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">
                          {t(`process.steps.${step}.title`)}
                        </h3>
                        <p className="text-sm text-muted max-w-xs">
                          {t(`process.steps.${step}.description`)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="relative z-10 w-10 h-10 rounded-full bg-accent text-background flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1 hidden md:block" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Section */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection>
            <div className="text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-accent/10 via-background to-background border border-accent/20">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("maintenance.title")}
              </h2>
              <p className="text-lg text-accent font-medium mb-4">
                {t("maintenance.subtitle")}
              </p>
              <p className="text-muted mb-8 max-w-2xl mx-auto">
                {t("maintenance.description")}
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm text-foreground"
                  >
                    <CheckIcon />
                    {t(`maintenance.features.${idx}`)}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-3xl px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("faq.title")}
            </h2>
          </AnimatedSection>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <AnimatedSection key={faq} delay={idx * 50}>
                <details className="group rounded-2xl bg-card border border-border hover:border-accent/30 transition-all">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-medium text-foreground pr-4">
                      {t(`faq.items.${faq}.question`)}
                    </h3>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center text-foreground group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-muted">
                    {t(`faq.items.${faq}.answer`)}
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-card to-background">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection>
            <div className="text-center p-8 md:p-12 rounded-3xl bg-foreground">
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-lg text-background/80 mb-8 max-w-xl mx-auto">
                {t("cta.subtitle")}
              </p>
              
              <a
                href={`${WHATSAPP_URL}información%20sobre%20los%20packs`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-green-500 px-10 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:bg-green-600 shadow-lg shadow-green-500/30"
              >
                <WhatsAppIcon />
                {t("cta.button")}
              </a>
              
              <p className="mt-4 text-sm text-background/60">
                {t("cta.note")}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

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
    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zm-1.469-17.954c-.084.042-.168.084-.273.126v-.084c0-.504-.063-.903-.189-1.218l.462 1.176zm-.903-1.68c-.168.504-.378 1.092-.588 1.596v-.063c-.168-.462-.42-.798-.756-1.008l.336-.21c.294-.168.588-.294.882-.399.042.042.084.063.126.084zm.063-1.092c.063.021.126.042.168.063-.252.105-.525.231-.777.399l-.336.21c-.105-.084-.231-.147-.357-.21.315-.231.672-.378 1.05-.483.084.021.168.021.252.021zm-.546 7.476c.042-.693.063-1.302.063-1.848 0-.378-.021-.714-.042-1.008.21.063.399.147.567.252.378.252.63.672.756 1.26.063.315.084.714.084 1.176 0 .042 0 .105-.021.168h-1.407zm.903-3.738c-.084-.063-.168-.105-.252-.147.126-.504.252-.987.378-1.407.168.084.315.21.441.378.168.231.294.525.378.882-.315-.126-.63-.21-.945-.252v.546zm1.26 3.738c-.252.063-.525.126-.777.189-.063-.903-.21-1.596-.441-2.079.252-.063.525-.147.777-.252.252.525.399 1.26.441 2.142zm-3.192.777c-.042.21-.084.378-.126.504-.042.126-.084.21-.147.252-.063.042-.126.063-.21.063-.357 0-.693-.336-.987-1.008-.21-.483-.378-1.092-.504-1.827h1.974v2.016zm-1.974-2.604c.084-.756.231-1.407.441-1.953.231-.588.504-1.008.819-1.26.168-.126.336-.21.525-.252v3.465h-1.785zm1.785-4.074c-.252.063-.483.168-.693.315-.378.252-.714.672-.987 1.26-.231.504-.399 1.092-.504 1.764h-.903c.147-1.176.462-2.142.924-2.898.378-.609.819-1.05 1.323-1.323.294-.168.567-.294.84-.378v1.26zm-3.402 4.074h.84c-.147.945-.21 1.764-.21 2.457 0 .126 0 .273.021.441-.588.168-1.092.336-1.512.504l.063-.21c.168-.546.378-1.218.609-2.016.063-.189.126-.378.189-.588v-.588zm.294-3.528c-.462.756-.798 1.722-.966 2.898h-.714c.105-.756.315-1.428.609-2.016.252-.504.546-.903.882-1.197.147.126.252.21.189.315zm-2.163 3.528h.588c-.21.756-.399 1.386-.567 1.89l-.063.21c-.294.126-.546.273-.756.441v-.294c0-.735.252-1.512.798-2.247zm-1.491 4.305c.21-.168.462-.315.756-.441.042.294.105.567.168.819.126.462.294.861.504 1.197-.336-.21-.672-.546-.987-.987-.168-.21-.315-.42-.441-.588zm.441-2.058c.21-.168.462-.315.756-.441v.252c0 .21.021.399.042.588-.252.126-.504.273-.756.441v-.252c0-.21-.021-.399-.042-.588zm.756-1.743v.483c-.294.126-.546.273-.756.441.021-.336.084-.651.168-.924h.588zm2.625 4.452c-.168-.21-.315-.462-.441-.756.21-.126.441-.231.714-.315.126.483.315.882.588 1.197-.315-.021-.609-.063-.861-.126zm.189-1.554c.252-.084.546-.168.861-.231.021.168.063.336.105.504.063.252.147.483.252.693-.294.084-.588.189-.861.315-.168-.399-.294-.84-.357-1.281zm1.512 1.995c-.21-.273-.378-.609-.483-1.008.231-.042.462-.063.693-.084.126.441.315.84.567 1.176-.252-.021-.525-.042-.777-.084zm.189-1.617c.252-.021.504-.042.756-.042h.084c.042.42.126.798.252 1.134-.336.021-.672.063-.987.126-.063-.42-.105-.84-.105-1.218zm1.827 1.239c-.147-.315-.252-.693-.294-1.113.252.021.462.063.672.126.021.378.063.756.126 1.092-.168-.042-.336-.063-.504-.105zm.294-1.68c.063-.021.126-.021.189-.042.042.336.105.672.189.987-.126-.042-.252-.063-.378-.084v-.861zm.462 1.05c-.063-.294-.105-.588-.147-.882.168-.042.336-.063.504-.084.042.273.105.546.189.798-.189.063-.357.105-.546.168zm.987-.042c-.084-.231-.147-.483-.189-.756.126-.021.252-.021.378-.042.063.252.126.483.21.693-.126.042-.273.063-.399.105zm.672-.168c-.084-.189-.147-.399-.189-.609.126-.021.231-.021.357-.042.063.189.126.378.21.546-.126.042-.252.063-.378.105zm.672-.168c-.063-.147-.126-.315-.168-.483.126-.021.231-.021.336-.042.063.147.126.315.189.462-.126.021-.252.042-.357.063zm.588-.126c-.063-.126-.105-.252-.147-.378.105-.021.189-.021.294-.042.042.105.105.231.168.357-.105.021-.21.042-.315.063zm.483-.105c-.042-.105-.084-.21-.126-.315.084-.021.168-.021.252-.042.042.084.084.189.126.294-.084.021-.168.042-.252.063zm.42-.084c-.042-.084-.063-.168-.105-.252.063-.021.147-.021.21-.042.042.063.063.147.105.231-.063.021-.147.042-.21.063zm.336-.063c-.021-.063-.063-.126-.084-.189.063-.021.105-.021.168-.021.021.042.042.105.063.147-.042.021-.105.042-.147.063zm.273-.063c-.021-.042-.042-.105-.063-.147.042-.021.084-.021.126-.021.021.042.042.084.042.126-.042.021-.063.021-.105.042zm.189-.042c-.021-.021-.021-.063-.042-.084.021-.021.063-.021.084-.021.021.021.021.042.042.063-.021.021-.063.021-.084.042z"/>
    </svg>
  ),
  wordpress: (
    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.034 1.232-.105 1.232-.105.582-.07.514-.93-.067-.899 0 0-1.755.138-2.883.138-1.059 0-2.84-.138-2.84-.138-.581-.03-.648.857-.066.899 0 0 .552.07 1.129.105l1.677 4.59-2.357 7.071-3.923-11.661c.648-.034 1.231-.105 1.231-.105.582-.07.514-.93-.066-.899 0 0-1.755.138-2.883.138-.203 0-.441-.005-.693-.013C4.198 3.831 7.779 2.059 11.788 2.059c2.985 0 5.704 1.143 7.744 3.011-.05-.003-.1-.009-.151-.009-1.059 0-1.81.92-1.81 1.91 0 .889.513 1.64 1.059 2.528.411.716.89 1.64.89 2.972 0 .921-.354 1.988-.822 3.473l-1.078 3.599-3.902-11.608m.463 17.749c-1.16.355-2.398.549-3.688.549-1.077 0-2.124-.141-3.124-.403l3.32-9.648 3.402 9.321c.023.055.049.107.076.158l.014.023m-4.163-19.59c-5.516 0-9.999 4.484-9.999 10s4.483 10 9.999 10c5.517 0 10-4.483 10-10 0-5.515-4.483-10-10-10m0 19.834c-5.421 0-9.834-4.412-9.834-9.834S6.367 2.166 11.788 2.166c5.422 0 9.835 4.413 9.835 9.834 0 5.422-4.413 9.834-9.835 9.834"/>
    </svg>
  ),
  nextjs: (
    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.251 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
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

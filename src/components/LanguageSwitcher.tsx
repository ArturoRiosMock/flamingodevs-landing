"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((loc, index) => (
        <span key={loc} className="flex items-center">
          <button
            onClick={() => handleChange(loc)}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              locale === loc
                ? "text-foreground font-medium"
                : "text-muted hover:text-foreground"
            }`}
          >
            {loc.toUpperCase()}
          </button>
          {index < locales.length - 1 && (
            <span className="text-border">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

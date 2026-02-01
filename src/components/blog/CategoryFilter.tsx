'use client';

import { useTranslations } from 'next-intl';
import { getCategoryLabel } from '@/lib/blog';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  locale: string;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  locale,
}: CategoryFilterProps) {
  const t = useTranslations('blog');

  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none rounded-full border border-border bg-card px-5 py-3 pr-10 text-sm text-foreground transition-all focus:border-[#212121]/30 focus:outline-none focus:ring-2 focus:ring-[#212121]/10 cursor-pointer"
      >
        <option value="">{t('allCategories')}</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {getCategoryLabel(category, locale)}
          </option>
        ))}
      </select>

      {/* Icono de flecha */}
      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

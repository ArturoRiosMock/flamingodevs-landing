'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PostMeta } from '@/lib/mdx';
import { formatDate, getCategoryLabel } from '@/lib/blog';

interface PostCardProps {
  post: PostMeta;
  locale: string;
  featured?: boolean;
}

export function PostCard({ post, locale, featured = false }: PostCardProps) {
  const t = useTranslations('blog');
  const { frontmatter, readingTime, slug } = post;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-[#212121]/20 hover:shadow-lg ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {/* Imagen */}
      <Link
        href={`/${locale}/blog/${slug}`}
        className={`relative overflow-hidden ${
          featured ? 'md:w-1/2' : 'aspect-[16/9]'
        }`}
      >
        {frontmatter.image ? (
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#212121]/10 to-muted flex items-center justify-center">
            <svg
              className="h-12 w-12 text-muted-foreground/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Contenido */}
      <div className={`flex flex-1 flex-col p-6 ${featured ? 'md:w-1/2' : ''}`}>
        {/* Categoría y tiempo de lectura */}
        <div className="mb-3 flex items-center gap-3 text-xs">
          <Link
            href={`/${locale}/blog?category=${frontmatter.category}`}
            className="rounded-full bg-[#212121]/5 px-3 py-1 font-medium text-[#212121] transition-colors hover:bg-[#212121]/10"
          >
            {getCategoryLabel(frontmatter.category, locale)}
          </Link>
          <span className="text-muted-foreground">
            {readingTime.replace('min read', t('minRead'))}
          </span>
        </div>

        {/* Título */}
        <h2
          className={`font-semibold text-foreground transition-colors group-hover:text-[#212121] ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          <Link href={`/${locale}/blog/${slug}`} className="line-clamp-2">
            {frontmatter.title}
          </Link>
        </h2>

        {/* Descripción */}
        <p className="mt-3 line-clamp-2 flex-1 text-muted-foreground">
          {frontmatter.description}
        </p>

        {/* Footer: fecha y tags */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <time className="text-sm text-muted-foreground" dateTime={frontmatter.date}>
            {formatDate(frontmatter.date, locale)}
          </time>
          
          <div className="flex gap-2">
            {frontmatter.tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/blog?tag=${tag}`}
                className="text-xs text-muted-foreground transition-colors hover:text-[#212121]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-[#212121]/5 via-transparent to-[#212121]/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
    </article>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Post } from '@/lib/mdx';
import { formatDate, getCategoryLabel } from '@/lib/blog';

interface PostHeaderProps {
  post: Post;
  locale: string;
}

export function PostHeader({ post, locale }: PostHeaderProps) {
  const t = useTranslations('blog');
  const { frontmatter, readingTime } = post;

  return (
    <header className="relative">
      {/* Imagen de fondo */}
      {frontmatter.image ? (
        <div className="relative h-[40vh] min-h-[300px] w-full">
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      ) : (
        <div className="h-32 w-full bg-gradient-to-r from-[#212121]/5 to-muted" />
      )}

      {/* Contenido del header */}
      <div className="mx-auto max-w-3xl px-6 -mt-32 relative z-10">
        {/* Navegación de regreso */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground mb-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t('backToBlog')}
        </Link>

        {/* Categoría */}
        <Link
          href={`/${locale}/blog?category=${frontmatter.category}`}
          className="inline-block rounded-full bg-[#212121] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#212121]/90 mb-4"
        >
          {getCategoryLabel(frontmatter.category, locale)}
        </Link>

        {/* Título */}
        <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl leading-tight">
          {frontmatter.title}
        </h1>

        {/* Descripción */}
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          {frontmatter.description}
        </p>

        {/* Meta info */}
        <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-border py-4">
          {/* Autor */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#212121] to-muted">
              <Image
                src="/christian-rios.png"
                alt={frontmatter.author}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{frontmatter.author}</p>
              <p className="text-xs text-muted-foreground">
                {t('publishedOn')} {formatDate(frontmatter.date, locale)}
              </p>
            </div>
          </div>

          {/* Separador */}
          <div className="hidden h-8 w-px bg-border md:block" />

          {/* Tiempo de lectura */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {readingTime.replace('min read', t('minRead'))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {frontmatter.tags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/blog?tag=${tag}`}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-[#212121]/10 hover:text-[#212121]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

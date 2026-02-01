'use client';

import { useTranslations } from 'next-intl';
import { PostMeta } from '@/lib/mdx';
import { PostCard } from './PostCard';

interface RelatedPostsProps {
  posts: PostMeta[];
  locale: string;
}

export function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = useTranslations('blog');

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-2xl font-bold text-foreground">
          {t('relatedPosts')}
        </h2>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

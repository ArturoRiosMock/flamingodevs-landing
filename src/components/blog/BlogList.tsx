'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { PostMeta } from '@/lib/mdx';
import { PostCard } from './PostCard';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { TagCloud } from './TagCloud';

interface BlogListProps {
  posts: PostMeta[];
  categories: string[];
  tags: string[];
  currentCategory?: string;
  currentTag?: string;
  currentSearch?: string;
  locale: string;
}

export function BlogList({
  posts,
  categories,
  tags,
  currentCategory,
  currentTag,
  currentSearch,
  locale,
}: BlogListProps) {
  const t = useTranslations('blog');
  const [searchQuery, setSearchQuery] = useState(currentSearch || '');
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || '');
  const [selectedTag, setSelectedTag] = useState(currentTag || '');

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((post) => {
        const inTitle = post.frontmatter.title.toLowerCase().includes(query);
        const inDescription = post.frontmatter.description.toLowerCase().includes(query);
        const inTags = post.frontmatter.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        return inTitle || inDescription || inTags;
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (post) =>
          post.frontmatter.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.frontmatter.tags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag;

  return (
    <div className="space-y-8">
      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('search')}
        />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          locale={locale}
        />
      </div>

      {/* Tags populares */}
      {tags.length > 0 && (
        <TagCloud
          tags={tags}
          selected={selectedTag}
          onSelect={setSelectedTag}
        />
      )}

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'resultado' : 'resultados'}
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-[#212121] underline underline-offset-2 hover:text-[#212121]/70 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grid de posts */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground">
            {t('noPostsFound')}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {t('noPostsDescription')}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#212121] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#212121]/90"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

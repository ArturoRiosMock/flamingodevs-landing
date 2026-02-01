import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/mdx';
import { PostHeader } from '@/components/blog/PostHeader';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { BlogJsonLd } from '@/components/blog/BlogJsonLd';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ['es', 'en', 'pt'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found | Flamingo Devs',
    };
  }

  const { frontmatter } = post;

  return {
    title: `${frontmatter.title} | Flamingo Devs Blog`,
    description: frontmatter.description,
    authors: [{ name: frontmatter.author }],
    keywords: frontmatter.tags,
    alternates: {
      canonical: `https://flamingodevs.com/${locale}/blog/${slug}`,
      languages: {
        es: `https://flamingodevs.com/es/blog/${slug}`,
        en: `https://flamingodevs.com/en/blog/${slug}`,
        pt: `https://flamingodevs.com/pt/blog/${slug}`,
      },
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `https://flamingodevs.com/${locale}/blog/${slug}`,
      siteName: 'Flamingo Devs',
      locale: locale === 'es' ? 'es_ES' : locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
      images: frontmatter.image
        ? [
            {
              url: frontmatter.image.startsWith('http')
                ? frontmatter.image
                : `https://flamingodevs.com${frontmatter.image}`,
              width: 1200,
              height: 630,
              alt: frontmatter.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.image ? [frontmatter.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(locale, slug, 3);

  return (
    <>
      <BlogJsonLd post={post} locale={locale} />
      
      <main className="min-h-screen bg-background pt-24">
        {/* Header del artículo */}
        <PostHeader post={post} locale={locale} />

        {/* Contenido principal */}
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            {/* Artículo */}
            <article className="prose prose-lg prose-gray max-w-none">
              <BlogPostContent content={post.content} />
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </div>

        {/* Posts relacionados */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} locale={locale} />
        )}
      </main>
    </>
  );
}

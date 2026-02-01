import { Post } from '@/lib/mdx';

interface BlogJsonLdProps {
  post: Post;
  locale: string;
}

export function BlogJsonLd({ post, locale }: BlogJsonLdProps) {
  const { frontmatter, readingTime, slug } = post;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.image
      ? frontmatter.image.startsWith('http')
        ? frontmatter.image
        : `https://flamingodevs.com${frontmatter.image}`
      : 'https://flamingodevs.com/og-image.png',
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      '@type': 'Person',
      name: frontmatter.author,
      url: 'https://flamingodevs.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Flamingo Devs',
      url: 'https://flamingodevs.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://flamingodevs.com/og-image.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://flamingodevs.com/${locale}/blog/${slug}`,
    },
    keywords: frontmatter.tags.join(', '),
    articleSection: frontmatter.category,
    wordCount: Math.round(parseInt(readingTime) * 200),
    inLanguage: locale === 'es' ? 'es-ES' : locale === 'pt' ? 'pt-BR' : 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

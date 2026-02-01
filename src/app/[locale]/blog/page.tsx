import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllPostsMeta, getAllCategories, getAllTags } from '@/lib/mdx';
import { BlogList } from '@/components/blog/BlogList';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string; q?: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const meta = await getTranslations({ locale, namespace: 'metadata' });

  const titles: Record<string, string> = {
    es: 'Blog - Artículos sobre Desarrollo Web y Automatización | Flamingo Devs',
    en: 'Blog - Articles on Web Development and Automation | Flamingo Devs',
    pt: 'Blog - Artigos sobre Desenvolvimento Web e Automação | Flamingo Devs',
  };

  const descriptions: Record<string, string> = {
    es: 'Lee artículos sobre desarrollo web, Shopify, automatización con IA y tecnología. Tutoriales, consejos y tendencias del sector.',
    en: 'Read articles about web development, Shopify, AI automation and technology. Tutorials, tips and industry trends.',
    pt: 'Leia artigos sobre desenvolvimento web, Shopify, automação com IA e tecnologia. Tutoriais, dicas e tendências do setor.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `https://flamingodevs.com/${locale}/blog`,
      languages: {
        es: 'https://flamingodevs.com/es/blog',
        en: 'https://flamingodevs.com/en/blog',
        pt: 'https://flamingodevs.com/pt/blog',
      },
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `https://flamingodevs.com/${locale}/blog`,
      siteName: 'Flamingo Devs',
      locale: locale === 'es' ? 'es_ES' : locale === 'pt' ? 'pt_BR' : 'en_US',
      type: 'website',
    },
  };
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const { category, tag, q } = await searchParams;
  
  setRequestLocale(locale);
  
  const t = await getTranslations('blog');
  
  let posts = getAllPostsMeta(locale);
  const categories = getAllCategories(locale);
  const tags = getAllTags(locale);

  // Filtrar por categoría
  if (category) {
    posts = posts.filter(
      (post) => post.frontmatter.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filtrar por tag
  if (tag) {
    posts = posts.filter((post) =>
      post.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Filtrar por búsqueda
  if (q) {
    const query = q.toLowerCase();
    posts = posts.filter((post) => {
      const inTitle = post.frontmatter.title.toLowerCase().includes(query);
      const inDescription = post.frontmatter.description.toLowerCase().includes(query);
      const inTags = post.frontmatter.tags.some((t) => t.toLowerCase().includes(query));
      return inTitle || inDescription || inTags;
    });
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </header>

        {/* Blog List Component */}
        <BlogList
          posts={posts}
          categories={categories}
          tags={tags}
          currentCategory={category}
          currentTag={tag}
          currentSearch={q}
          locale={locale}
        />
      </div>
    </main>
  );
}

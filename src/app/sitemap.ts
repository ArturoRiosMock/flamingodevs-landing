import { MetadataRoute } from 'next';
import { getAllPostsMeta } from '@/lib/mdx';

const BASE_URL = 'https://flamingodevs.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'es', 'pt'];
  const lastModified = new Date();

  // Generate sitemap entries for each locale
  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    // Main page for each locale (Google no indexa fragmentos # en sitemaps)
    sitemapEntries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    });

    // Blog index page
    sitemapEntries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    });

    // Tools index page
    sitemapEntries.push({
      url: `${BASE_URL}/${locale}/herramientas`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // Web Analyzer tool
    sitemapEntries.push({
      url: `${BASE_URL}/${locale}/herramientas/analizador-web`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Tech Detector tool
    sitemapEntries.push({
      url: `${BASE_URL}/${locale}/herramientas/detector-tecnologias`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Store Auditor tool
    sitemapEntries.push({
      url: `${BASE_URL}/${locale}/herramientas/auditor-tiendas`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Blog posts
    const posts = getAllPostsMeta(locale);
    posts.forEach((post) => {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.frontmatter.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  // Root URL (redirects to default locale)
  sitemapEntries.unshift({
    url: BASE_URL,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  return sitemapEntries;
}

import { MetadataRoute } from 'next';

const BASE_URL = 'https://flamingodevs.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'es', 'pt'];
  const lastModified = new Date();

  // Generate sitemap entries for each locale
  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    // Main page for each locale
    sitemapEntries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    });

    // Section anchors for each locale (helps with deep linking SEO)
    const sections = ['services', 'about', 'portfolio', 'contact'];
    sections.forEach((section) => {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}#${section}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
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

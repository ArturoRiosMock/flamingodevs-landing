/**
 * Formatea una fecha para mostrar en el blog
 */
export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  
  const localeMap: Record<string, string> = {
    es: 'es-ES',
    en: 'en-US',
    pt: 'pt-BR',
  };

  return date.toLocaleDateString(localeMap[locale] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Genera un excerpt del contenido
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  // Eliminar markdown básico
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength).trim() + '...';
}

/**
 * Genera URLs para las rutas del blog
 */
export function getBlogUrls(locale: string) {
  const base = `/${locale}/blog`;
  
  return {
    blog: base,
    post: (slug: string) => `${base}/${slug}`,
    category: (category: string) => `${base}/category/${encodeURIComponent(category)}`,
    tag: (tag: string) => `${base}/tag/${encodeURIComponent(tag)}`,
  };
}

/**
 * Mapeo de categorías para traducciones
 */
export const categoryLabels: Record<string, Record<string, string>> = {
  'desarrollo-web': {
    es: 'Desarrollo Web',
    en: 'Web Development',
    pt: 'Desenvolvimento Web',
  },
  'automatizacion': {
    es: 'Automatización',
    en: 'Automation',
    pt: 'Automação',
  },
  'ecommerce': {
    es: 'E-commerce',
    en: 'E-commerce',
    pt: 'E-commerce',
  },
  'shopify': {
    es: 'Shopify',
    en: 'Shopify',
    pt: 'Shopify',
  },
  'tutorial': {
    es: 'Tutorial',
    en: 'Tutorial',
    pt: 'Tutorial',
  },
  'inteligencia-artificial': {
    es: 'Inteligencia Artificial',
    en: 'Artificial Intelligence',
    pt: 'Inteligência Artificial',
  },
};

/**
 * Obtiene la etiqueta traducida de una categoría
 */
export function getCategoryLabel(category: string, locale: string): string {
  return categoryLabels[category]?.[locale] || category;
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const POSTS_PATH = path.join(process.cwd(), 'content', 'posts');

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
  locale: string;
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
  readingTime: string;
  locale: string;
}

/**
 * Obtiene todos los archivos MDX de un locale específico
 */
export function getPostSlugs(locale: string): string[] {
  const localePath = path.join(POSTS_PATH, locale);
  
  if (!fs.existsSync(localePath)) {
    return [];
  }
  
  return fs.readdirSync(localePath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Obtiene un post por su slug y locale
 */
export function getPostBySlug(slug: string, locale: string): Post | null {
  const filePath = path.join(POSTS_PATH, locale, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);
  
  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: stats.text,
    locale,
  };
}

/**
 * Obtiene todos los posts de un locale específico
 */
export function getAllPosts(locale: string): Post[] {
  const slugs = getPostSlugs(locale);
  
  const posts = slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    .filter((post) => !post.frontmatter.draft)
    .sort((a, b) => 
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
  
  return posts;
}

/**
 * Obtiene los metadatos de todos los posts (sin contenido)
 */
export function getAllPostsMeta(locale: string): PostMeta[] {
  const posts = getAllPosts(locale);
  
  return posts.map(({ slug, frontmatter, readingTime, locale }) => ({
    slug,
    frontmatter,
    readingTime,
    locale,
  }));
}

/**
 * Obtiene posts destacados
 */
export function getFeaturedPosts(locale: string, limit = 3): PostMeta[] {
  const posts = getAllPostsMeta(locale);
  
  return posts
    .filter((post) => post.frontmatter.featured)
    .slice(0, limit);
}

/**
 * Obtiene posts por categoría
 */
export function getPostsByCategory(locale: string, category: string): PostMeta[] {
  const posts = getAllPostsMeta(locale);
  
  return posts.filter(
    (post) => post.frontmatter.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Obtiene posts por tag
 */
export function getPostsByTag(locale: string, tag: string): PostMeta[] {
  const posts = getAllPostsMeta(locale);
  
  return posts.filter((post) =>
    post.frontmatter.tags.some(
      (t) => t.toLowerCase() === tag.toLowerCase()
    )
  );
}

/**
 * Obtiene todas las categorías únicas
 */
export function getAllCategories(locale: string): string[] {
  const posts = getAllPostsMeta(locale);
  const categories = new Set<string>();
  
  posts.forEach((post) => {
    categories.add(post.frontmatter.category);
  });
  
  return Array.from(categories).sort();
}

/**
 * Obtiene todos los tags únicos
 */
export function getAllTags(locale: string): string[] {
  const posts = getAllPostsMeta(locale);
  const tags = new Set<string>();
  
  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

/**
 * Obtiene posts relacionados basándose en categoría y tags
 */
export function getRelatedPosts(
  locale: string,
  currentSlug: string,
  limit = 3
): PostMeta[] {
  const currentPost = getPostBySlug(currentSlug, locale);
  if (!currentPost) return [];
  
  const allPosts = getAllPostsMeta(locale);
  
  const scoredPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0;
      
      // Misma categoría
      if (post.frontmatter.category === currentPost.frontmatter.category) {
        score += 3;
      }
      
      // Tags en común
      const commonTags = post.frontmatter.tags.filter((tag) =>
        currentPost.frontmatter.tags.includes(tag)
      );
      score += commonTags.length;
      
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
  
  return scoredPosts;
}

/**
 * Busca posts por texto en título, descripción y tags
 */
export function searchPosts(locale: string, query: string): PostMeta[] {
  const posts = getAllPostsMeta(locale);
  const lowerQuery = query.toLowerCase();
  
  return posts.filter((post) => {
    const inTitle = post.frontmatter.title.toLowerCase().includes(lowerQuery);
    const inDescription = post.frontmatter.description.toLowerCase().includes(lowerQuery);
    const inTags = post.frontmatter.tags.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );
    const inCategory = post.frontmatter.category.toLowerCase().includes(lowerQuery);
    
    return inTitle || inDescription || inTags || inCategory;
  });
}

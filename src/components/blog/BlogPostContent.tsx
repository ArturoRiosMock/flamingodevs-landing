'use client';

import { useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  const components: Partial<Components> = useMemo(
    () => ({
      h1: ({ children }) => {
        const id = children
          ?.toString()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return (
          <h1 id={id} className="text-4xl font-bold mt-8 mb-4 text-foreground scroll-mt-28">
            {children}
          </h1>
        );
      },
      h2: ({ children }) => {
        const id = children
          ?.toString()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return (
          <h2 id={id} className="text-3xl font-semibold mt-10 mb-4 text-foreground scroll-mt-28">
            {children}
          </h2>
        );
      },
      h3: ({ children }) => {
        const id = children
          ?.toString()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return (
          <h3 id={id} className="text-2xl font-semibold mt-8 mb-3 text-foreground scroll-mt-28">
            {children}
          </h3>
        );
      },
      h4: ({ children }) => (
        <h4 className="text-xl font-medium mt-6 mb-2 text-foreground">
          {children}
        </h4>
      ),
      p: ({ children }) => (
        <p className="text-muted-foreground leading-relaxed mb-6">
          {children}
        </p>
      ),
      a: ({ href, children }) => {
        const isInternal = href?.startsWith('/') || href?.startsWith('#');
        if (isInternal) {
          return (
            <Link
              href={href || '#'}
              className="text-[#212121] underline underline-offset-2 hover:text-[#212121]/70 transition-colors"
            >
              {children}
            </Link>
          );
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#212121] underline underline-offset-2 hover:text-[#212121]/70 transition-colors"
          >
            {children}
          </a>
        );
      },
      ul: ({ children }) => (
        <ul className="list-disc list-inside mb-6 space-y-2 text-muted-foreground ml-4">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal list-inside mb-6 space-y-2 text-muted-foreground ml-4">
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className="leading-relaxed">
          {children}
        </li>
      ),
      pre: ({ children }) => (
        <pre className="bg-[#212121] text-white p-6 rounded-xl overflow-x-auto mb-6 text-sm leading-relaxed">
          {children}
        </pre>
      ),
      code: ({ children, className }) => {
        const isInline = !className;
        if (isInline) {
          return (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-[#212121]">
              {children}
            </code>
          );
        }
        return (
          <code className={className}>
            {children}
          </code>
        );
      },
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-[#212121] pl-6 my-6 italic text-muted-foreground bg-muted/30 py-4 pr-4 rounded-r-lg">
          {children}
        </blockquote>
      ),
      img: ({ src, alt }) => (
        <span className="block my-8">
          {typeof src === 'string' && (
            <Image
              src={src}
              alt={alt || ''}
              width={800}
              height={450}
              className="rounded-xl"
            />
          )}
          {alt && (
            <span className="block text-center text-sm text-muted-foreground mt-2">
              {alt}
            </span>
          )}
        </span>
      ),
      hr: () => <hr className="my-10 border-border" />,
      table: ({ children }) => (
        <div className="overflow-x-auto mb-6 rounded-lg border border-border">
          <table className="w-full">
            {children}
          </table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border-b border-border px-4 py-3 bg-muted font-semibold text-left text-foreground">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border-b border-border px-4 py-3 text-muted-foreground">
          {children}
        </td>
      ),
    }),
    []
  );

  return (
    <div className="max-w-3xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

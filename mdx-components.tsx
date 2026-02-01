import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings con estilos
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mt-8 mb-3 text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-medium mt-4 mb-2 text-foreground">{children}</h4>
    ),
    
    // Parrafos y texto
    p: ({ children }) => (
      <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
    ),
    
    // Links
    a: ({ href, children }) => {
      const isInternal = href?.startsWith('/') || href?.startsWith('#');
      if (isInternal) {
        return (
          <Link href={href || '#'} className="text-[#212121] underline underline-offset-2 hover:text-[#212121]/70 transition-colors">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#212121] underline underline-offset-2 hover:text-[#212121]/70 transition-colors">
          {children}
        </a>
      );
    },
    
    // Listas
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    
    // Bloques de código
    pre: ({ children }) => (
      <pre className="bg-[#212121] text-white p-4 rounded-lg overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
    
    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#212121] pl-4 my-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    
    // Imagenes
    img: (props) => (
      <Image
        {...props}
        alt={props.alt || ''}
        width={800}
        height={400}
        className="rounded-lg my-4"
      />
    ),
    
    // Horizontal rule
    hr: () => <hr className="my-8 border-border" />,
    
    // Tablas
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">{children}</th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2">{children}</td>
    ),
    
    // Componentes personalizados adicionales
    ...components,
  };
}

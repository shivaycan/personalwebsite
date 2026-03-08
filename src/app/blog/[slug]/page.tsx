import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { SiteNav } from '@/components/site-nav';
import { getAllSlugs, getPostBySlug, type BlogFrontmatter } from '@/lib/blog';

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { frontmatter } = getPostBySlug(slug);
    return {
      title: frontmatter.title,
      description: `Read ${frontmatter.title} on the personal blog.`
    };
  } catch {
    return {
      title: 'Post Not Found'
    };
  }
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getPostBySlug(slug);
    const { content: rendered } = await compileMDX<BlogFrontmatter>({
      source: content,
      options: {
        parseFrontmatter: false
      }
    });

    return (
      <main className="page-shell">
        <div className="fade-up" style={{ '--delay': '40ms' } as CSSProperties}>
          <SiteNav />
        </div>
        <article
          className="prose prose-neutral fade-up max-w-none prose-headings:tracking-tight prose-p:text-neutral-700 prose-a:no-underline prose-a:font-medium sm:prose-lg"
          style={{ '--delay': '120ms' } as CSSProperties}
        >
          <h1>{frontmatter.title}</h1>
          <p className="text-sm text-neutral-600">{frontmatter.date}</p>
          {rendered}
        </article>
      </main>
    );
  } catch {
    notFound();
  }
}

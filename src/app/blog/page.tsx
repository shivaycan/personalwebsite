import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Personal Blog',
  description: 'MDX-powered personal writing by SHI.VAY.'
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="page-shell">
      <div className="fade-up" style={{ '--delay': '40ms' } as CSSProperties}>
        <SiteNav />
      </div>
      <h1
        className="fade-up mb-8 text-3xl font-semibold tracking-tight sm:text-4xl"
        style={{ '--delay': '120ms' } as CSSProperties}
      >
        Personal Blog
      </h1>
      <div className="space-y-8">
        {posts.map((post, index) => (
          <article
            className="tile fade-up"
            style={{ '--delay': `${170 + index * 80}ms` } as CSSProperties}
            key={post.slug}
          >
            <h2 className="text-2xl font-medium">
              <Link className="hairline-link" href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-neutral-600">{post.date}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={`${post.slug}-${tag}`}
                  className="rounded-full border border-neutral-300 px-2.5 py-1 text-xs text-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

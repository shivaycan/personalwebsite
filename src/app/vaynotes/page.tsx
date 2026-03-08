import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'VAYNOTES',
  description: 'Personal writing and notes by SHI.VAY.'
};

export default function VayNotesPage() {
  const posts = getAllPosts();

  return (
    <main className="page-shell">
      <div className="fade-up" style={{ '--delay': '40ms' } as CSSProperties}>
        <SiteNav />
      </div>
      <h1
        className="editorial fade-up mb-8 text-4xl tracking-tight text-neutral-100 sm:text-5xl"
        style={{ '--delay': '120ms' } as CSSProperties}
      >
        VAYNOTES
      </h1>
      <div className="space-y-8">
        {posts.map((post, index) => (
          <article
            className="tile fade-up"
            style={{ '--delay': `${170 + index * 80}ms` } as CSSProperties}
            key={post.slug}
          >
            <h2 className="editorial text-3xl leading-tight">
              <Link className="hairline-link" href={`/vaynotes/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-neutral-400">{post.date}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={`${post.slug}-${tag}`}
                  className="rounded-full border border-white/20 px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-neutral-300"
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

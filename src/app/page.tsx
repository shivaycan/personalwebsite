import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { projects } from '@/lib/projects';

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 2);

  return (
    <main className="home-shell">
      <section className="home-grid">
        <div>
          <p
            className="fade-up text-xs uppercase tracking-[0.28em] text-neutral-500"
            style={{ '--delay': '40ms' } as CSSProperties}
          >
            Portfolio + Journal
          </p>
          <h1
            className="editorial fade-up mt-5 text-6xl leading-none tracking-[0.1em] text-neutral-950 sm:text-8xl"
            style={{ '--delay': '100ms' } as CSSProperties}
          >
            SHI.VAY
          </h1>
          <p
            className="fade-up mt-8 max-w-xl text-base leading-8 text-neutral-700 sm:text-lg"
            style={{ '--delay': '180ms' } as CSSProperties}
          >
            Building thoughtful software, sharing practical ideas, and documenting real work in
            public.
          </p>
          <div
            className="fade-up mt-9 flex flex-wrap items-center gap-8 text-base font-semibold"
            style={{ '--delay': '260ms' } as CSSProperties}
          >
            <Link className="hairline-link" href="/projects">
              Projects
            </Link>
            <Link className="hairline-link" href="/blog">
              Personal Blog
            </Link>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {projects.slice(0, 2).map((project, index) => (
              <article
                className="tile fade-up"
                style={{ '--delay': `${320 + index * 90}ms` } as CSSProperties}
                key={project.name}
              >
                <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Project</p>
                <h2 className="editorial mt-2 text-2xl leading-tight">{project.name}</h2>
                <p className="mt-3 text-sm leading-7 text-neutral-700">{project.description}</p>
                <a className="hairline-link mt-4 inline-block text-sm" href={project.github}>
                  View on GitHub
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="fade-up" style={{ '--delay': '220ms' } as CSSProperties}>
          <div className="hero-art">
            <div className="grid-line absolute inset-0 rounded-3xl" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Latest Writing</p>
              <div className="mt-6 space-y-6">
                {latestPosts.map((post) => (
                  <article key={post.slug}>
                    <p className="text-xs text-neutral-500">{post.date}</p>
                    <h3 className="editorial mt-2 text-2xl leading-tight text-neutral-900">
                      <Link className="hairline-link" href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={`${post.slug}-${tag}`}
                          className="rounded-full border border-neutral-300 px-2.5 py-1 text-[11px] uppercase tracking-wider text-neutral-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

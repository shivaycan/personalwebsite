import type { CSSProperties } from 'react';
import Link from 'next/link';
import { VayMenu } from '@/components/vay-menu';
import { getAllPosts } from '@/lib/blog';

export default function HomePage() {
  const latestPosts = getAllPosts();

  return (
    <main className="bharat-shell">
      <section className="bharat-frame">
        <div className="rangoli-glow rangoli-left" />
        <div className="rangoli-glow rangoli-right" />
        <p
          className="fade-up text-center text-xs uppercase tracking-[0.26em] text-neutral-400"
          style={{ '--delay': '40ms' } as CSSProperties}
        >
          Crafted in public
        </p>

        <h1
          className="hero-word fade-up mt-8 flex flex-wrap items-center justify-center gap-1 text-6xl tracking-wide text-neutral-100 sm:text-8xl md:text-9xl"
          style={{ '--delay': '120ms' } as CSSProperties}
        >
          <span>shi.</span>
          <VayMenu />
        </h1>

        <p
          className="fade-up mx-auto mt-8 max-w-2xl text-center text-base leading-8 text-neutral-300 sm:text-lg"
          style={{ '--delay': '210ms' } as CSSProperties}
        >
          Software builder from India, blending engineering systems with intentional design.
          This space combines my project journey and personal notes.
        </p>

        <div
          className="fade-up mt-10 flex flex-wrap justify-center gap-8 text-sm font-semibold lowercase tracking-[0.12em]"
          style={{ '--delay': '280ms' } as CSSProperties}
        >
          <Link className="hairline-link" href="/vayworks">
            vayworks
          </Link>
          <Link className="hairline-link" href="/vaynotes">
            vaynotes
          </Link>
          <Link className="hairline-link" href="/writeup">
            writeup
          </Link>
        </div>

        <section className="vaynotes-band fade-up" style={{ '--delay': '360ms' } as CSSProperties}>
          <div className="vaynotes-head">
            <h2 className="editorial text-3xl lowercase sm:text-4xl">vaynotes</h2>
            <Link className="hairline-link text-sm" href="/vaynotes">
              View all notes
            </Link>
          </div>
          <div className="vaynotes-grid">
            {latestPosts.map((post) => (
              <article className="note-card" key={post.slug}>
                <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">{post.date}</p>
                <h3 className="editorial mt-3 text-2xl leading-tight">
                  <Link className="hairline-link" href={`/vaynotes/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      className="rounded-full border border-white/25 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-neutral-300"
                      key={`${post.slug}-${tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

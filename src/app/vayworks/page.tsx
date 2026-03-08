import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/site-nav';
import { projects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'VAYWORKS',
  description: 'Project work by SHI.VAY.'
};

export default function VayWorksPage() {
  return (
    <main className="page-shell">
      <div className="fade-up" style={{ '--delay': '40ms' } as CSSProperties}>
        <SiteNav />
      </div>
      <h1
        className="editorial fade-up mb-8 text-4xl tracking-tight text-neutral-100 sm:text-5xl"
        style={{ '--delay': '120ms' } as CSSProperties}
      >
        VAYWORKS
      </h1>
      <div className="space-y-8">
        {projects.map((project, index) => (
          <article
            className="tile fade-up"
            style={{ '--delay': `${170 + index * 80}ms` } as CSSProperties}
            key={project.name}
          >
            <h2 className="text-2xl font-medium">{project.name}</h2>
            <p className="mt-2 text-neutral-300">{project.description}</p>
            <p className="mt-3 text-sm text-neutral-300">
              GitHub:{' '}
              <a className="hairline-link" href={project.github} target="_blank" rel="noreferrer">
                {project.github}
              </a>
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

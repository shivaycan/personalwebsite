import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/site-nav';
import { projects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'GitHub projects by SHI.VAY.'
};

export default function ProjectsPage() {
  return (
    <main className="page-shell">
      <div className="fade-up" style={{ '--delay': '40ms' } as CSSProperties}>
        <SiteNav />
      </div>
      <h1
        className="fade-up mb-8 text-3xl font-semibold tracking-tight sm:text-4xl"
        style={{ '--delay': '120ms' } as CSSProperties}
      >
        Projects
      </h1>
      <div className="space-y-8">
        {projects.map((project, index) => (
          <article
            className="tile fade-up"
            style={{ '--delay': `${170 + index * 80}ms` } as CSSProperties}
            key={project.name}
          >
            <h2 className="text-xl font-medium">{project.name}</h2>
            <p className="mt-2 text-neutral-700/90">{project.description}</p>
            <p className="mt-3 text-sm text-neutral-700">
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

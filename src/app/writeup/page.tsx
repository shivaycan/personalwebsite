import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/site-nav';
import { WriteupEditor } from '@/components/writeup-editor';

export const metadata: Metadata = {
  title: 'Writeup',
  description: 'Write and publish blogs directly from the website editor.'
};

export default function WriteupPage() {
  return (
    <main className="page-shell">
      <div className="fade-up" style={{ '--delay': '40ms' } as CSSProperties}>
        <SiteNav />
      </div>
      <h1
        className="editorial fade-up mb-8 text-4xl tracking-tight text-neutral-100 sm:text-5xl"
        style={{ '--delay': '120ms' } as CSSProperties}
      >
        writeup
      </h1>
      <div className="fade-up" style={{ '--delay': '170ms' } as CSSProperties}>
        <WriteupEditor />
      </div>
    </main>
  );
}

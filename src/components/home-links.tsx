import Link from 'next/link';

export function HomeLinks() {
  return (
    <div className="mt-8 flex items-center justify-center gap-8 text-base font-medium sm:text-lg">
      <Link className="hairline-link" href="/projects">
        Projects
      </Link>
      <Link className="hairline-link" href="/blog">
        Personal Blog
      </Link>
    </div>
  );
}

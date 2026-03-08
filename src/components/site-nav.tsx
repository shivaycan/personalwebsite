import Link from 'next/link';

export function SiteNav() {
  return (
    <nav className="mb-10 flex items-center gap-6 text-sm text-neutral-300">
      <Link className="hairline-link" href="/">
        Home
      </Link>
      <Link className="hairline-link" href="/writeup">
        Writeup
      </Link>
    </nav>
  );
}

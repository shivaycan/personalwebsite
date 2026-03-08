import Link from 'next/link';

export function SiteNav() {
  return (
    <nav className="mb-10 text-sm text-neutral-300">
      <Link className="hairline-link" href="/">
        Home
      </Link>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function VayMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) {
        return;
      }
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="relative inline-flex" ref={wrapperRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="vay-trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        vay
      </button>
      <div className={`vay-dropdown ${open ? 'vay-dropdown-open' : ''}`} role="menu">
        <Link className="vay-option" href="/vayworks" onClick={() => setOpen(false)} role="menuitem">
          vayworks
        </Link>
        <Link className="vay-option" href="/vaynotes" onClick={() => setOpen(false)} role="menuitem">
          vaynotes
        </Link>
      </div>
    </div>
  );
}

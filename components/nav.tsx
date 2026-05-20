'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLang } from '@/components/lang/lang-provider';

export function Nav() {
  const pathname = usePathname();
  const { lang, toggle } = useLang();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = !isHome || scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex justify-between items-center transition-all duration-300 ${
        solid
          ? 'bg-bone/95 backdrop-blur-md border-b border-line py-4 px-6 md:px-10'
          : 'bg-transparent py-5 px-6 md:px-10'
      }`}
    >
      <Link href="/" className="font-display text-[1.4rem] font-normal tracking-[-0.01em] text-ink no-underline">
        Paradise <em className="italic text-aegean">Imroz</em>
      </Link>
      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex gap-7">
          <Link href="/odalar" className="text-ink no-underline text-[0.85rem] tracking-[0.04em] uppercase hover:text-aegean transition-colors">
            {lang === 'tr' ? 'Odalar' : 'Rooms'}
          </Link>
          <Link href="/aktiviteler" className="text-ink no-underline text-[0.85rem] tracking-[0.04em] uppercase hover:text-aegean transition-colors">
            {lang === 'tr' ? 'Aktiviteler' : 'Activities'}
          </Link>
          <Link href="/galeri" className="text-ink no-underline text-[0.85rem] tracking-[0.04em] uppercase hover:text-aegean transition-colors">
            {lang === 'tr' ? 'Galeri' : 'Gallery'}
          </Link>
          <Link href="/konum" className="text-ink no-underline text-[0.85rem] tracking-[0.04em] uppercase hover:text-aegean transition-colors">
            {lang === 'tr' ? 'Konum' : 'Location'}
          </Link>
        </div>
        <button onClick={toggle} className="lang-btn">
          {lang === 'tr' ? 'EN' : 'TR'}
        </button>
        <Link href="/rezervasyon" className="btn-reserve">
          {lang === 'tr' ? 'Rezervasyon' : 'Reserve'}
        </Link>
      </div>
    </nav>
  );
}

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

  // Transparan modda cream metin + cream çerçeve; katı modda ink.
  const wrapperCls = solid
    ? 'bg-bone/95 backdrop-blur-md border-b border-line py-4 px-6 md:px-10'
    : 'bg-gradient-to-b from-aegean-deep/40 to-transparent py-5 px-6 md:px-10';

  const textCls = solid ? 'text-ink' : 'text-cream';
  const accentCls = solid ? 'text-aegean' : 'text-cream/85';
  const hoverCls = solid ? 'hover:text-aegean' : 'hover:text-terracotta';

  const langBtnCls = solid
    ? 'border-ink text-ink hover:bg-ink hover:text-bone'
    : 'border-cream/70 text-cream hover:bg-cream hover:text-ink';

  const reserveBtnCls = solid
    ? 'bg-ink text-bone hover:bg-aegean'
    : 'bg-cream text-ink hover:bg-terracotta hover:text-cream';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex justify-between items-center transition-all duration-300 ${wrapperCls}`}
    >
      <Link
        href="/"
        className={`font-display text-[1.4rem] font-normal tracking-[-0.01em] no-underline transition-colors ${textCls}`}
      >
        Paradise <em className={`italic ${accentCls}`}>Imroz</em>
      </Link>
      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex gap-7">
          <Link
            href="/odalar"
            className={`no-underline text-[0.85rem] tracking-[0.04em] uppercase transition-colors ${textCls} ${hoverCls}`}
          >
            {lang === 'tr' ? 'Odalar' : 'Rooms'}
          </Link>
          <Link
            href="/#yorumlar"
            className={`no-underline text-[0.85rem] tracking-[0.04em] uppercase transition-colors ${textCls} ${hoverCls}`}
          >
            {lang === 'tr' ? 'Yorumlar' : 'Reviews'}
          </Link>
          <Link
            href="/galeri"
            className={`no-underline text-[0.85rem] tracking-[0.04em] uppercase transition-colors ${textCls} ${hoverCls}`}
          >
            {lang === 'tr' ? 'Galeri' : 'Gallery'}
          </Link>
          <Link
            href="/konum"
            className={`no-underline text-[0.85rem] tracking-[0.04em] uppercase transition-colors ${textCls} ${hoverCls}`}
          >
            {lang === 'tr' ? 'Konum' : 'Location'}
          </Link>
        </div>
        <button
          onClick={toggle}
          className={`bg-transparent border px-3 py-2 font-body text-[0.75rem] tracking-[0.08em] cursor-pointer transition-colors ${langBtnCls}`}
        >
          {lang === 'tr' ? 'EN' : 'TR'}
        </button>
        <Link
          href="/rezervasyon"
          className={`border-0 px-6 py-3 font-body text-[0.8rem] tracking-[0.08em] uppercase cursor-pointer transition-colors no-underline inline-block ${reserveBtnCls}`}
        >
          {lang === 'tr' ? 'Rezervasyon' : 'Reserve'}
        </Link>
      </div>
    </nav>
  );
}

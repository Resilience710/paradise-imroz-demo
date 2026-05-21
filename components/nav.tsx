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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const solid = !isHome || scrolled || menuOpen;

  const wrapperCls = solid
    ? 'bg-bone/95 backdrop-blur-md border-b border-line py-3 md:py-4 px-4 md:px-10'
    : 'bg-gradient-to-b from-aegean-deep/40 to-transparent py-4 md:py-5 px-4 md:px-10';

  const textCls = solid ? 'text-ink' : 'text-cream';
  const accentCls = solid ? 'text-aegean' : 'text-cream/85';
  const hoverCls = solid ? 'hover:text-aegean' : 'hover:text-terracotta';

  const langBtnCls = solid
    ? 'border-ink text-ink hover:bg-ink hover:text-bone'
    : 'border-cream/70 text-cream hover:bg-cream hover:text-ink';

  const reserveBtnCls = solid
    ? 'bg-ink text-bone hover:bg-aegean'
    : 'bg-cream text-ink hover:bg-terracotta hover:text-cream';

  const burgerCls = solid ? 'text-ink' : 'text-cream';

  const links: { href: string; tr: string; en: string }[] = [
    { href: '/odalar', tr: 'Odalar', en: 'Rooms' },
    { href: '/#yorumlar', tr: 'Yorumlar', en: 'Reviews' },
    { href: '/galeri', tr: 'Galeri', en: 'Gallery' },
    { href: '/konum', tr: 'Konum', en: 'Location' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex justify-between items-center transition-all duration-300 ${wrapperCls}`}
      >
        <Link
          href="/"
          className={`font-display text-[1.2rem] md:text-[1.4rem] font-normal tracking-[-0.01em] no-underline transition-colors ${textCls}`}
        >
          Paradise <em className={`italic ${accentCls}`}>Imroz</em>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4 md:gap-8">
          <div className="flex gap-7">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`no-underline text-[0.85rem] tracking-[0.04em] uppercase transition-colors ${textCls} ${hoverCls}`}
              >
                {lang === 'tr' ? l.tr : l.en}
              </Link>
            ))}
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

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/rezervasyon"
            className={`border-0 px-3 py-2 font-body text-[0.7rem] tracking-[0.08em] uppercase cursor-pointer transition-colors no-underline inline-block ${reserveBtnCls}`}
          >
            {lang === 'tr' ? 'Rezervasyon' : 'Reserve'}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className={`relative w-10 h-10 flex items-center justify-center ${burgerCls}`}
          >
            <span className={`absolute h-px w-6 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-px w-6 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute h-px w-6 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[95] md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-bone shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-6 pt-24 pb-4 border-b border-line">
            <div className="text-[0.65rem] tracking-[0.3em] uppercase text-muted mb-2">{lang === 'tr' ? 'Menü' : 'Menu'}</div>
            <div className="font-display text-3xl">Paradise <em className="italic text-aegean">Imroz</em></div>
          </div>

          <nav className="flex-1 px-6 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block font-display text-2xl py-3 border-b border-line hover:text-aegean transition-colors"
                  >
                    {lang === 'tr' ? l.tr : l.en}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-line">
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-muted mb-3">{lang === 'tr' ? 'İletişim' : 'Contact'}</div>
              <a href="tel:+905433990032" className="block font-display text-lg text-ink mb-1">0543 399 00 32</a>
              <a href="mailto:info@paradiseimroz.com" className="block text-sm text-muted">info@paradiseimroz.com</a>
            </div>
          </nav>

          <div className="px-6 py-6 border-t border-line flex items-center gap-3">
            <button
              onClick={toggle}
              className="bg-transparent border border-ink text-ink px-4 py-2 text-[0.75rem] tracking-[0.08em] hover:bg-ink hover:text-bone transition-colors"
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <Link
              href="/rezervasyon"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center bg-ink text-bone px-6 py-3 text-[0.8rem] tracking-[0.08em] uppercase no-underline hover:bg-aegean transition-colors"
            >
              {lang === 'tr' ? 'Rezervasyon yap' : 'Reserve'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import Link from 'next/link';
import { useLang } from '@/components/lang/lang-provider';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-bone pt-16 pb-8 px-6 md:px-10 border-t border-line">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
        <div>
          <div className="font-display text-3xl font-light mb-4">
            Paradise <em className="italic text-aegean">Imroz</em>
          </div>
          <p className="italic font-display text-muted max-w-[280px]">
            {t("Gökçeada'nın kalbinde, sekiz odalı bir mola.", 'A boutique pause of eight rooms, in the heart of Gökçeada.')}
          </p>
        </div>
        <div>
          <h4 className="text-[0.72rem] tracking-[0.3em] uppercase text-muted mb-5 font-medium">
            {t('Otel', 'Hotel')}
          </h4>
          <Link href="/" className="block text-ink no-underline mb-2 text-sm hover:text-aegean">
            {t('Hikaye', 'Story')}
          </Link>
          <Link href="/odalar" className="block text-ink no-underline mb-2 text-sm hover:text-aegean">
            {t('Odalar', 'Rooms')}
          </Link>
          <Link href="/aktiviteler" className="block text-ink no-underline mb-2 text-sm hover:text-aegean">
            {t('Aktiviteler', 'Activities')}
          </Link>
          <Link href="/galeri" className="block text-ink no-underline mb-2 text-sm hover:text-aegean">
            {t('Galeri', 'Gallery')}
          </Link>
        </div>
        <div>
          <h4 className="text-[0.72rem] tracking-[0.3em] uppercase text-muted mb-5 font-medium">
            {t('İletişim', 'Contact')}
          </h4>
          <p className="text-sm mb-2">Fatih Mh. Yaşar Doğu Sk. No:7</p>
          <p className="text-sm mb-2">Gökçeada · Çanakkale</p>
          <a href="mailto:info@paradiseimroz.com" className="block text-ink no-underline mb-2 text-sm hover:text-aegean">
            info@paradiseimroz.com
          </a>
        </div>
        <div>
          <h4 className="text-[0.72rem] tracking-[0.3em] uppercase text-muted mb-5 font-medium">
            {t('Takip et', 'Follow')}
          </h4>
          <a href="#" className="block text-ink no-underline mb-2 text-sm hover:text-aegean">Instagram</a>
          <a href="#" className="block text-ink no-underline mb-2 text-sm hover:text-aegean">Facebook</a>
          <a href="#" className="block text-ink no-underline mb-2 text-sm hover:text-aegean">TripAdvisor</a>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto pt-8 border-t border-line flex flex-col md:flex-row justify-between gap-2 text-[0.78rem] text-muted tracking-[0.05em]">
        <span>
          © 2026 Paradise Imroz · {t('Tüm hakları saklıdır', 'All rights reserved')}
        </span>
        <span>
          {t('Yapım', 'Built with care')} · <em className="italic">Gökçeada</em>
        </span>
      </div>
    </footer>
  );
}

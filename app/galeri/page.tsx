'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/reveal';
import { PageHeader } from '@/components/page-header';
import { useLang } from '@/components/lang/lang-provider';
import { galleryImages } from '@/lib/data';

export default function GalleryPage() {
  const { t } = useLang();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <main className="pb-24">
      <PageHeader
        eyebrow={{ tr: 'Galeri', en: 'Gallery' }}
        title={{
          tr: <>Otel, bahçe, oda <em>ve etraf</em>.</>,
          en: <>Hotel, garden, rooms <em>and around</em>.</>,
        }}
        lead={{
          tr: 'Fotoğraflara tıklayarak büyütebilirsiniz. Mayıs ile ekim arasında otel ve çevresinden kareler.',
          en: 'Click any photo to enlarge. Frames from the hotel and around, between May and October.',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryImages.map((img, i) => (
            <Reveal key={i}>
              <button
                onClick={() => setOpenIdx(i)}
                className="block w-full overflow-hidden bg-aegean break-inside-avoid mb-4"
              >
                <div className={`relative ${i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-[4/3]' : 'aspect-square'}`}>
                  <Image
                    src={img.src}
                    alt={t(img.alt.tr, img.alt.en)}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {openIdx !== null && (
        <div
          onClick={() => setOpenIdx(null)}
          className="fixed inset-0 bg-ink/95 z-[200] flex items-center justify-center p-6 cursor-zoom-out"
        >
          <div className="relative w-full max-w-[1400px] max-h-[90vh] aspect-[3/2]">
            <Image
              src={galleryImages[openIdx].src.replace('w=1600', 'w=2400')}
              alt={t(galleryImages[openIdx].alt.tr, galleryImages[openIdx].alt.en)}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx(null);
            }}
            className="absolute top-6 right-6 text-cream text-xs tracking-[0.2em] uppercase border border-cream/40 px-4 py-2 hover:bg-cream hover:text-ink transition-colors"
          >
            {t('Kapat', 'Close')} ×
          </button>
        </div>
      )}
    </main>
  );
}

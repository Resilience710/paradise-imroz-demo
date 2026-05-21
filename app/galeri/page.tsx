'use client';

import { useEffect, useMemo, useState } from 'react';
import { Reveal } from '@/components/reveal';
import { PageHeader } from '@/components/page-header';
import { useLang } from '@/components/lang/lang-provider';
import { staticPhotos, listAdminPhotos, onPhotosChange, categoryLabels, type Photo, type PhotoCategory } from '@/lib/photos';

export default function GalleryPage() {
  const { t } = useLang();
  const [admin, setAdmin] = useState<Photo[]>([]);
  const [filter, setFilter] = useState<PhotoCategory | 'all'>('all');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => setAdmin(listAdminPhotos());
    refresh();
    return onPhotosChange(refresh);
  }, []);

  const all = useMemo(() => [...staticPhotos, ...admin], [admin]);
  const visible = useMemo(() => (filter === 'all' ? all : all.filter((p) => p.category === filter)), [all, filter]);

  const categories: (PhotoCategory | 'all')[] = ['all', 'cephe', 'oda', 'kahvalti', 'manzara', 'bahce'];

  return (
    <main className="pb-24">
      <PageHeader
        eyebrow={{ tr: 'Galeri', en: 'Gallery' }}
        title={{
          tr: <>Otel, oda, kahvaltı <em>ve manzara</em>.</>,
          en: <>Hotel, rooms, breakfast <em>and view</em>.</>,
        }}
        lead={{
          tr: "Otelin gerçek fotoğraflarından bir seçki. Fotoğrafa tıklayarak büyütebilirsin.",
          en: "A selection of real photos from the hotel. Click a photo to enlarge.",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 text-[0.72rem] tracking-[0.15em] uppercase border transition-colors ${
              filter === c ? 'bg-ink text-cream border-ink' : 'border-line hover:bg-cream'
            }`}
          >
            {c === 'all' ? t('Tümü', 'All') : t(categoryLabels[c].tr, categoryLabels[c].en)}
            <span className="ml-2 opacity-70">
              {c === 'all' ? all.length : all.filter((p) => p.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {visible.length === 0 ? (
          <p className="text-muted text-center py-16">{t('Bu kategoride foto yok.', 'No photos in this category.')}</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {visible.map((p, i) => (
              <Reveal key={p.id}>
                <button
                  onClick={() => setOpenIdx(i)}
                  className="block w-full overflow-hidden bg-aegean break-inside-avoid mb-4 group relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={t(p.alt.tr, p.alt.en)}
                    className={`w-full ${i % 4 === 0 ? 'aspect-[3/4]' : i % 4 === 1 ? 'aspect-[4/3]' : i % 4 === 2 ? 'aspect-square' : 'aspect-[4/5]'} object-cover transition-transform duration-700 group-hover:scale-105`}
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent text-cream px-3 py-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {t(p.alt.tr, p.alt.en)}
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {openIdx !== null && (
        <div
          onClick={() => setOpenIdx(null)}
          className="fixed inset-0 bg-ink/95 z-[200] flex items-center justify-center p-6 cursor-zoom-out"
        >
          <div className="relative w-full max-w-[1400px] max-h-[90vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visible[openIdx].src}
              alt={t(visible[openIdx].alt.tr, visible[openIdx].alt.en)}
              className="max-w-full max-h-[90vh] object-contain"
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
          <div className="absolute bottom-6 left-6 right-6 text-cream text-sm text-center">
            {t(visible[openIdx].alt.tr, visible[openIdx].alt.en)}
          </div>
        </div>
      )}
    </main>
  );
}

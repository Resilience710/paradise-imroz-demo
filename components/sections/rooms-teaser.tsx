'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';
import { rooms as staticRooms, type Room, amenityLabels, hotelAmenities } from '@/lib/data';
import { fetchRoomSettings, mergeRoom, onRoomsChange } from '@/lib/rooms';

export function RoomsTeaser() {
  const { t, lang } = useLang();
  const [merged, setMerged] = useState<Room[]>(staticRooms);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const o = await fetchRoomSettings();
      if (cancelled) return;
      setMerged(staticRooms.map((r) => mergeRoom(r, o.find((x) => x.slug === r.slug))));
    };
    refresh();
    const off = onRoomsChange(refresh);
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  const featured = merged.slice(0, 4);

  return (
    <section id="rooms" className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-28">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-end mb-12">
          <div>
            <div className="eyebrow">{t('Odalar', 'The rooms')}</div>
            <h2 className="section-title">
              {lang === 'tr' ? (
                <>Sekiz oda, <em>sekiz farklı sessizlik</em>.</>
              ) : (
                <>Eight rooms, <em>eight kinds of quiet</em>.</>
              )}
            </h2>
          </div>
          <p className="text-[1.05rem] leading-relaxed text-muted max-w-[440px]">
            {t(
              'Hiçbiri büyük değil, hiçbiri lüks değil. Her birinde balkon, klima, kendi banyosu ve bir yerlerden gelen ağustos böceği sesi.',
              'None of them are big, none are luxurious. Each has a balcony, A/C, a private bath, and the sound of cicadas from somewhere.'
            )}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featured.map((room) => (
            <Link key={room.slug} href={`/odalar/${room.slug}`} className="block group">
              <div className="aspect-[4/5] bg-aegean overflow-hidden mb-4 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.images[0]}
                  alt={t(room.name.tr, room.name.en)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="font-display text-xl mb-1">{t(room.name.tr, room.name.en)}</div>
              <div className="text-sm text-muted">{t(room.tagline.tr, room.tagline.en)}</div>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="text-center mb-16">
          <Link href="/odalar" className="btn-reserve">
            {t('Tüm odaları gör', 'View all rooms')}
          </Link>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-b border-line">
          {hotelAmenities.map((key, i) => (
            <div
              key={key}
              className={`flex items-center gap-3 p-6 text-sm ${
                (i + 1) % 4 !== 0 ? 'md:border-r' : ''
              } ${(i + 1) % 2 !== 0 ? 'sm:border-r' : ''} border-line`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
              {t(amenityLabels[key].tr, amenityLabels[key].en)}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Reveal } from '@/components/reveal';
import { PageHeader } from '@/components/page-header';
import { useLang } from '@/components/lang/lang-provider';
import { rooms as staticRooms, type Room, amenityLabels } from '@/lib/data';
import { fetchRoomSettings, mergeRoom, onRoomsChange } from '@/lib/rooms';
import { formatPrice } from '@/lib/booking';

export default function RoomsPage() {
  const { t, lang } = useLang();
  const [merged, setMerged] = useState<Room[]>(staticRooms);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const overrides = await fetchRoomSettings();
      if (cancelled) return;
      setMerged(staticRooms.map((r) => mergeRoom(r, overrides.find((o) => o.slug === r.slug))));
    };
    refresh();
    const off = onRoomsChange(refresh);
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  return (
    <main className="pb-24">
      <PageHeader
        eyebrow={{ tr: 'Odalar', en: 'Rooms' }}
        title={{
          tr: <>Sekiz oda, <em>sekiz farklı sessizlik</em>.</>,
          en: <>Eight rooms, <em>eight kinds of quiet</em>.</>,
        }}
        lead={{
          tr: 'Her oda farklı bir köşede, farklı bir manzarada. Hiçbiri büyük değil, hiçbiri lüks değil — ama her birinde küçük bir farkındalık var.',
          en: "Every room is in a different corner, with a different view. None are big, none are luxurious — but each has a small intention.",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {merged.map((room) => (
          <Reveal key={room.slug}>
            <Link href={`/odalar/${room.slug}`} className="block group">
              <div className="aspect-[4/5] bg-aegean overflow-hidden mb-5 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.images[0]}
                  alt={t(room.name.tr, room.name.en)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-display text-2xl">{t(room.name.tr, room.name.en)}</h2>
                <div className="text-[0.78rem] tracking-[0.18em] uppercase text-muted">
                  {room.size}m² · {t(`${room.capacity} kişi`, `${room.capacity} ${room.capacity === 1 ? 'person' : 'people'}`)}
                </div>
              </div>
              <div className="text-muted text-sm mb-4">{t(room.tagline.tr, room.tagline.en)}</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 4).map((a) => (
                  <span key={a} className="text-[0.72rem] tracking-wide uppercase text-aegean border border-line px-2 py-1">
                    {t(amenityLabels[a].tr, amenityLabels[a].en)}
                  </span>
                ))}
              </div>
              <div className="flex items-baseline justify-between pt-4 border-t border-line">
                <div>
                  <span className="font-display text-2xl text-aegean">{formatPrice(room.pricePerNight, lang)}</span>
                  <span className="text-muted text-sm ml-2">/ {t('gece', 'night')}</span>
                </div>
                <span className="text-[0.78rem] tracking-[0.15em] uppercase text-terracotta">
                  {t('Detay', 'View')} →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}

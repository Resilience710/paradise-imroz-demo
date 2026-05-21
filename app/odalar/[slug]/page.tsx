'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { rooms as staticRooms, type Room, amenityLabels } from '@/lib/data';
import { fetchRoomSettings, mergeRoom, onRoomsChange } from '@/lib/rooms';
import { useLang } from '@/components/lang/lang-provider';
import { Reveal } from '@/components/reveal';
import { formatPrice } from '@/lib/booking';

export default function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const base = staticRooms.find((r) => r.slug === slug);
  const { t, lang } = useLang();
  const [room, setRoom] = useState<Room | null>(base || null);
  const [allRooms, setAllRooms] = useState<Room[]>(staticRooms);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      if (!base) return;
      const overrides = await fetchRoomSettings();
      if (cancelled) return;
      setRoom(mergeRoom(base, overrides.find((o) => o.slug === slug)));
      setAllRooms(staticRooms.map((r) => mergeRoom(r, overrides.find((o) => o.slug === r.slug))));
    };
    refresh();
    const off = onRoomsChange(refresh);
    return () => {
      cancelled = true;
      off();
    };
  }, [slug, base]);

  if (!base) return notFound();
  if (!room) return null;

  return (
    <main className="pt-32 pb-24 max-w-[1400px] mx-auto px-6 md:px-10">
      <div className="text-[0.78rem] tracking-[0.18em] uppercase text-muted mb-4">
        <Link href="/odalar" className="hover:text-aegean">{t('Odalar', 'Rooms')}</Link>
        <span className="mx-2">·</span>
        {t(room.name.tr, room.name.en)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 mb-20">
        <div>
          <div className="aspect-[4/3] relative bg-aegean overflow-hidden mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={room.images[activeImg] || room.images[0]}
              alt={t(room.name.tr, room.name.en)}
              className="absolute inset-0 w-full h-full object-cover transition-opacity"
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {room.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActiveImg(i)}
                className={`aspect-[4/3] relative overflow-hidden bg-aegean border-2 transition-colors ${
                  activeImg === i ? 'border-terracotta' : 'border-transparent'
                }`}
                aria-label={`Image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="section-title mb-4">{t(room.name.tr, room.name.en)}</h1>
          <p className="font-display italic text-xl text-aegean mb-6">{t(room.tagline.tr, room.tagline.en)}</p>
          <p className="text-[1.05rem] leading-relaxed mb-8">{t(room.description.tr, room.description.en)}</p>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-6 border-t border-line mb-8">
            <Spec label={t('Kapasite', 'Capacity')} value={t(`${room.capacity} kişi`, `${room.capacity} ${room.capacity === 1 ? 'person' : 'people'}`)} />
            <Spec label={t('Yatak', 'Bed')} value={t(room.bed.tr, room.bed.en)} />
            <Spec label={t('Büyüklük', 'Size')} value={`${room.size} m²`} />
            <Spec label={t('Manzara', 'View')} value={
              room.view === 'sea' ? t('Deniz', 'Sea') :
              room.view === 'garden' ? t('Bahçe', 'Garden') :
              t('Şehir', 'City')
            } />
            <Spec label={t('Blok', 'Block')} value={`${room.block}`} />
            <Spec label={t('Kat', 'Floor')} value={room.floor === 0 ? t('Zemin', 'Ground') : `${room.floor}`} />
          </div>

          <div className="mb-8">
            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-3">{t('Donanım', 'Amenities')}</div>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((a) => (
                <span key={a} className="text-[0.78rem] tracking-wide uppercase text-aegean border border-line px-3 py-1.5">
                  {t(amenityLabels[a].tr, amenityLabels[a].en)}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-cream border border-line p-6 mb-6">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="font-display text-3xl text-aegean">{formatPrice(room.pricePerNight, lang)}</div>
                <div className="text-muted text-sm">{t('gecelik', 'per night')}</div>
              </div>
              <div className="text-right text-[0.78rem] tracking-[0.15em] uppercase text-muted">
                {t('Kahvaltı opsiyonel', 'Breakfast optional')}
              </div>
            </div>
            <Link href={`/rezervasyon?room=${room.slug}`} className="btn-terracotta block text-center w-full">
              {t('Bu odayı rezerve et', 'Reserve this room')}
            </Link>
          </div>
        </div>
      </div>

      <Reveal>
        <div className="border-t border-line pt-12">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-6">
            {t('Diğer odalar', 'Other rooms')}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allRooms.filter((r) => r.slug !== room.slug).slice(0, 4).map((r) => (
              <Link key={r.slug} href={`/odalar/${r.slug}`} className="block group">
                <div className="aspect-[4/5] relative overflow-hidden bg-aegean mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.images[0]} alt={t(r.name.tr, r.name.en)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="font-display text-lg">{t(r.name.tr, r.name.en)}</div>
                <div className="text-muted text-sm">{formatPrice(r.pricePerNight, lang)} / {t('gece', 'night')}</div>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[0.68rem] tracking-[0.25em] uppercase text-muted mb-1">{label}</div>
      <div className="font-display text-lg">{value}</div>
    </div>
  );
}

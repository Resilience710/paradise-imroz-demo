'use client';

import Image from 'next/image';
import { useLang } from '@/components/lang/lang-provider';
import { rooms, amenityLabels } from '@/lib/data';
import { isRoomAvailable } from '@/lib/mock-bookings';
import { formatPrice, nightsBetween } from '@/lib/booking';

type Props = {
  checkIn: Date;
  checkOut: Date;
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  onBack: () => void;
};

export function RoomStep({ checkIn, checkOut, selectedSlug, onSelect, onBack }: Props) {
  const { t, lang } = useLang();
  const nights = nightsBetween(checkIn, checkOut);

  const available = rooms.filter((r) => isRoomAvailable(r.slug, checkIn, checkOut));
  const unavailable = rooms.filter((r) => !isRoomAvailable(r.slug, checkIn, checkOut));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-muted">
          {t(
            `${available.length} / ${rooms.length} oda müsait · ${nights} gece`,
            `${available.length} of ${rooms.length} rooms available · ${nights} ${nights === 1 ? 'night' : 'nights'}`
          )}
        </p>
        <button onClick={onBack} className="text-[0.78rem] tracking-[0.15em] uppercase text-aegean hover:text-terracotta">
          ← {t('Tarihleri değiştir', 'Change dates')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {available.map((room) => (
          <button
            key={room.slug}
            onClick={() => onSelect(room.slug)}
            className={`text-left bg-cream border-2 transition-colors hover:border-terracotta ${
              selectedSlug === room.slug ? 'border-terracotta' : 'border-line'
            }`}
          >
            <div className="aspect-[16/9] relative bg-aegean overflow-hidden">
              <Image src={room.images[0]} alt={t(room.name.tr, room.name.en)} fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" />
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-display text-2xl">{t(room.name.tr, room.name.en)}</h3>
                <div className="text-[0.7rem] tracking-[0.2em] uppercase text-muted">{room.size}m² · {room.capacity}p</div>
              </div>
              <p className="text-sm text-muted mb-4">{t(room.tagline.tr, room.tagline.en)}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {room.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="text-[0.68rem] tracking-wide uppercase text-aegean border border-line px-2 py-0.5">
                    {t(amenityLabels[a].tr, amenityLabels[a].en)}
                  </span>
                ))}
              </div>
              <div className="flex items-baseline justify-between pt-3 border-t border-line">
                <div>
                  <span className="font-display text-2xl text-aegean">{formatPrice(room.pricePerNight * nights, lang)}</span>
                  <div className="text-xs text-muted">
                    {formatPrice(room.pricePerNight, lang)} × {nights} {t('gece', nights === 1 ? 'night' : 'nights')}
                  </div>
                </div>
                <span className={`text-[0.78rem] tracking-[0.15em] uppercase ${selectedSlug === room.slug ? 'text-terracotta' : 'text-aegean'}`}>
                  {selectedSlug === room.slug ? t('Seçili', 'Selected') : t('Seç', 'Select')} →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {unavailable.length > 0 && (
        <div className="mt-12 pt-8 border-t border-line">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-4">
            {t('Bu tarihlerde dolu', 'Booked for these dates')}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
            {unavailable.map((r) => (
              <div key={r.slug} className="bg-cream border border-line p-4">
                <div className="aspect-[4/3] relative bg-aegean overflow-hidden mb-3">
                  <Image src={r.images[0]} alt="" fill className="object-cover grayscale" sizes="200px" />
                </div>
                <div className="font-display text-base">{t(r.name.tr, r.name.en)}</div>
                <div className="text-xs text-muted">{t('Dolu', 'Booked')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

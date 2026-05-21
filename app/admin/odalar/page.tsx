'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { rooms } from '@/lib/data';
import { listBookings, onBookingsChange, formatPrice, formatShortDate, type Booking } from '@/lib/booking';
import { useLang } from '@/components/lang/lang-provider';

export default function AdminRoomsPage() {
  const { t, lang } = useLang();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const refresh = () => setBookings(listBookings());
    refresh();
    return onBookingsChange(refresh);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const roomData = useMemo(() => {
    return rooms.map((room) => {
      const approved = bookings.filter((b) => b.roomSlug === room.slug && b.status === 'approved');
      const pending = bookings.filter((b) => b.roomSlug === room.slug && b.status === 'pending');
      const upcoming = [...approved, ...pending]
        .filter((b) => new Date(b.checkOut) >= today)
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
      const currentlyOccupied = approved.some(
        (b) => new Date(b.checkIn) <= today && new Date(b.checkOut) > today
      );
      return { room, approved, pending, upcoming, currentlyOccupied };
    });
  }, [bookings]);

  const occupiedCount = roomData.filter((r) => r.currentlyOccupied).length;
  const availableCount = rooms.length - occupiedCount;

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-between items-baseline gap-4">
        <div>
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-2">{t('Envanter', 'Inventory')}</div>
          <h1 className="font-display text-4xl">{t('Odalar', 'Rooms')}</h1>
        </div>
        <div className="flex gap-3">
          <span className="text-sm px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300">
            {availableCount} {t('müsait', 'available')}
          </span>
          <span className="text-sm px-3 py-1.5 bg-rose-100 text-rose-900 border border-rose-300">
            {occupiedCount} {t('dolu', 'occupied')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomData.map(({ room, approved, pending, upcoming, currentlyOccupied }) => (
          <div key={room.slug} className="bg-cream border border-line overflow-hidden">
            <div className="aspect-[16/10] relative bg-aegean">
              <Image src={room.images[0]} alt={t(room.name.tr, room.name.en)} fill className="object-cover" sizes="(min-width:1024px) 33vw, 50vw" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-[0.62rem] tracking-[0.15em] uppercase bg-ink text-cream px-2 py-1">
                  Blok {room.block}
                </span>
                <span
                  className={`text-[0.62rem] tracking-[0.15em] uppercase px-2 py-1 ${
                    currentlyOccupied
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {currentlyOccupied ? t('Şu an dolu', 'In-house') : t('Müsait', 'Available')}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-display text-2xl">{t(room.name.tr, room.name.en)}</h3>
                <div className="text-xs text-muted">{room.size}m² · {room.capacity}p</div>
              </div>
              <p className="text-sm text-muted mb-4">{t(room.tagline.tr, room.tagline.en)}</p>

              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <Mini label={t('Onaylı', 'Approved')} value={approved.length} />
                <Mini label={t('Bekleyen', 'Pending')} value={pending.length} accent="text-amber-600" />
                <Mini label={t('Gece', 'Night')} value={formatPrice(room.pricePerNight, lang)} compact />
              </div>

              <div className="border-t border-line pt-3">
                <div className="text-[0.62rem] tracking-[0.25em] uppercase text-muted mb-2">
                  {t('Yaklaşan rezervasyonlar', 'Upcoming bookings')}
                </div>
                {upcoming.length === 0 ? (
                  <p className="text-xs text-muted py-2">{t('Yaklaşan yok.', 'None upcoming.')}</p>
                ) : (
                  <ul className="space-y-1.5">
                    {upcoming.slice(0, 3).map((b) => (
                      <li key={b.code} className="flex items-baseline justify-between text-xs">
                        <span className="font-medium truncate">{b.fullName}</span>
                        <span className="text-muted whitespace-nowrap ml-2">
                          {formatShortDate(b.checkIn, lang)}–{formatShortDate(b.checkOut, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value, accent, compact }: { label: string; value: React.ReactNode; accent?: string; compact?: boolean }) {
  return (
    <div className="bg-bone py-2">
      <div className="text-[0.55rem] tracking-[0.2em] uppercase text-muted">{label}</div>
      <div className={`font-display ${compact ? 'text-sm' : 'text-xl'} ${accent || ''}`}>{value}</div>
    </div>
  );
}

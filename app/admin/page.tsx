'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { listBookings, onBookingsChange, formatPrice, STATUS_LABELS, type Booking } from '@/lib/booking';
import { rooms, hotelInfo } from '@/lib/data';
import { useLang } from '@/components/lang/lang-provider';

export default function AdminOverview() {
  const { t, lang } = useLang();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const refresh = () => setBookings(listBookings());
    refresh();
    return onBookingsChange(refresh);
  }, []);

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const approved = bookings.filter((b) => b.status === 'approved').length;
    const rejected = bookings.filter((b) => b.status === 'rejected').length;
    const revenue = bookings.filter((b) => b.status === 'approved').reduce((sum, b) => sum + b.total, 0);
    return { pending, approved, rejected, revenue, total: bookings.length };
  }, [bookings]);

  const recent = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div>
      <div className="mb-10">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-2">{t('Genel bakış', 'Overview')}</div>
        <h1 className="font-display text-4xl mb-2">{t('Hoş geldin', 'Welcome back')}</h1>
        <p className="text-muted">{t('Bugün otelin durumu.', "Today's status at the hotel.")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label={t('Bekleyen', 'Pending')} value={stats.pending} accent="text-amber-600" />
        <Stat label={t('Onaylı', 'Approved')} value={stats.approved} accent="text-emerald-600" />
        <Stat label={t('Reddedilen', 'Rejected')} value={stats.rejected} accent="text-rose-600" />
        <Stat label={t('Toplam gelir', 'Total revenue')} value={formatPrice(stats.revenue, lang)} small accent="text-aegean" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="bg-cream border border-line p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl">{t('Son talepler', 'Recent requests')}</h2>
            <Link href="/admin/rezervasyonlar" className="text-[0.75rem] tracking-[0.15em] uppercase text-aegean hover:text-terracotta">
              {t('Tümünü gör', 'View all')} →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center">
              {t('Henüz rezervasyon yok. Bir tane oluştur:', 'No reservations yet. Create one:')}{' '}
              <Link href="/rezervasyon" className="text-terracotta hover:underline">/rezervasyon</Link>
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((b) => {
                const room = rooms.find((r) => r.slug === b.roomSlug);
                const status = STATUS_LABELS[b.status];
                return (
                  <li key={b.code}>
                    <Link href={`/admin/rezervasyonlar?code=${b.code}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3 hover:bg-bone transition-colors -mx-2 px-2">
                      <div className="font-display text-aegean text-sm">{b.code}</div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{b.fullName}</div>
                        <div className="text-xs text-muted truncate">{room ? t(room.name.tr, room.name.en) : '?'} · {b.nights} {t('gece', 'n')}</div>
                      </div>
                      <span className={`text-[0.62rem] tracking-[0.15em] uppercase px-2 py-1 border ${status.color}`}>
                        {t(status.tr, status.en)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="bg-ink text-cream p-6">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-cream/50 mb-3">{t('Otel bilgileri', 'Hotel info')}</div>
          <h3 className="font-display text-2xl mb-1">{hotelInfo.fullName}</h3>
          <p className="text-cream/70 text-sm mb-6 italic font-display">
            {hotelInfo.rooms} {t('oda', 'rooms')} · {hotelInfo.blocks} {t('blok', 'blocks')} · {hotelInfo.roomSize}m²
          </p>
          <div className="space-y-3 text-sm">
            <Info label={t('Adres', 'Address')} value={t(hotelInfo.address.tr, hotelInfo.address.en)} />
            <Info label={t('Telefon', 'Phone')} value={hotelInfo.phoneDisplay} />
            <Info label="E-mail" value={hotelInfo.email} />
            <Info label={t('Giriş / çıkış', 'Check in / out')} value={`${hotelInfo.checkIn} / ${hotelInfo.checkOut}`} />
            <Info label={t('Sezon', 'Season')} value={t(hotelInfo.season.tr, hotelInfo.season.en)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, small }: { label: string; value: React.ReactNode; accent?: string; small?: boolean }) {
  return (
    <div className="bg-cream border border-line p-5">
      <div className="text-[0.65rem] tracking-[0.25em] uppercase text-muted mb-2">{label}</div>
      <div className={`font-display ${small ? 'text-2xl' : 'text-4xl'} ${accent || ''}`}>{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[0.62rem] tracking-[0.25em] uppercase text-cream/50 mb-0.5">{label}</div>
      <div className="text-cream">{value}</div>
    </div>
  );
}

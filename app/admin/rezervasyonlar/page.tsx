'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  listBookings,
  updateBookingStatus,
  deleteBooking,
  onBookingsChange,
  formatDate,
  formatShortDate,
  formatPrice,
  STATUS_LABELS,
  type Booking,
  type BookingStatus,
} from '@/lib/booking';
import { rooms } from '@/lib/data';
import { useLang } from '@/components/lang/lang-provider';

export default function ReservationsPage() {
  return (
    <Suspense fallback={<div className="text-muted">…</div>}>
      <ReservationsInner />
    </Suspense>
  );
}

function ReservationsInner() {
  const { t, lang } = useLang();
  const params = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(params.get('code'));
  const [note, setNote] = useState('');

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const b = await listBookings();
      if (!cancelled) setBookings(b);
    };
    refresh();
    const off = onBookingsChange(refresh);
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  // If incoming code from URL doesn't yet exist (storage race), keep selected for when it loads
  const filtered = useMemo(() => {
    const list = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [bookings, filter]);

  const selectedBooking = selected ? bookings.find((b) => b.code === selected) : null;
  const room = selectedBooking ? rooms.find((r) => r.slug === selectedBooking.roomSlug) : null;

  const handleDecide = (status: BookingStatus) => {
    if (!selectedBooking) return;
    updateBookingStatus(selectedBooking.code, status, note.trim() || undefined);
    setNote('');
  };

  const handleDelete = () => {
    if (!selectedBooking) return;
    if (!confirm(t('Bu rezervasyonu silmek istediğinden emin misin?', 'Delete this reservation?'))) return;
    deleteBooking(selectedBooking.code);
    setSelected(null);
  };

  const counts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      approved: bookings.filter((b) => b.status === 'approved').length,
      rejected: bookings.filter((b) => b.status === 'rejected').length,
    }),
    [bookings]
  );

  return (
    <div>
      <div className="mb-8">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-2">{t('Talepler', 'Requests')}</div>
        <h1 className="font-display text-4xl">{t('Rezervasyonlar', 'Reservations')}</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[0.75rem] tracking-[0.15em] uppercase border transition-colors ${
              filter === f ? 'bg-ink text-cream border-ink' : 'border-line hover:bg-cream'
            }`}
          >
            {f === 'all' ? t('Tümü', 'All') : t(STATUS_LABELS[f].tr, STATUS_LABELS[f].en)}
            <span className="ml-2 opacity-70">{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6">
        {/* List */}
        <div className="bg-cream border border-line">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-muted">
              {t('Bu filtrede rezervasyon yok.', 'No reservations match this filter.')}
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {filtered.map((b) => {
                const r = rooms.find((x) => x.slug === b.roomSlug);
                const status = STATUS_LABELS[b.status];
                return (
                  <li key={b.code}>
                    <button
                      onClick={() => setSelected(b.code)}
                      className={`w-full text-left px-5 py-4 transition-colors ${
                        selected === b.code ? 'bg-bone' : 'hover:bg-bone/50'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <div className="font-display text-aegean text-sm tracking-wide">{b.code}</div>
                        <span className={`text-[0.6rem] tracking-[0.15em] uppercase px-2 py-0.5 border ${status.color}`}>
                          {t(status.tr, status.en)}
                        </span>
                      </div>
                      <div className="font-medium truncate">{b.fullName}</div>
                      <div className="text-xs text-muted flex items-center gap-2 mt-1">
                        <span>{r ? t(r.name.tr, r.name.en) : '?'}</span>
                        <span>·</span>
                        <span>{formatShortDate(b.checkIn, lang)} → {formatShortDate(b.checkOut, lang)}</span>
                        <span>·</span>
                        <span>{formatPrice(b.total, lang)}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div>
          {!selectedBooking ? (
            <div className="bg-cream border border-line p-12 text-center text-muted">
              {t('Detay görmek için soldan bir rezervasyon seç.', 'Pick a reservation from the left to see details.')}
            </div>
          ) : (
            <div className="bg-cream border border-line">
              {room && (
                <div className="aspect-[16/9] relative bg-aegean overflow-hidden">
                  <Image src={room.images[0]} alt={t(room.name.tr, room.name.en)} fill className="object-cover" sizes="60vw" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="font-display text-aegean text-sm tracking-wide mb-1">{selectedBooking.code}</div>
                    <h2 className="font-display text-2xl">{selectedBooking.fullName}</h2>
                  </div>
                  <span
                    className={`text-[0.62rem] tracking-[0.15em] uppercase px-2.5 py-1 border ${STATUS_LABELS[selectedBooking.status].color}`}
                  >
                    {t(STATUS_LABELS[selectedBooking.status].tr, STATUS_LABELS[selectedBooking.status].en)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-6 text-sm">
                  <Detail label={t('Oda', 'Room')} value={room ? `${t(room.name.tr, room.name.en)} · Blok ${room.block}` : '?'} />
                  <Detail label={t('Misafir', 'Guests')} value={String(selectedBooking.guests)} />
                  <Detail label={t('Giriş', 'Check-in')} value={formatDate(selectedBooking.checkIn, lang)} />
                  <Detail label={t('Çıkış', 'Check-out')} value={formatDate(selectedBooking.checkOut, lang)} />
                  <Detail label={t('Gece', 'Nights')} value={String(selectedBooking.nights)} />
                  <Detail label={t('Toplam', 'Total')} value={<span className="text-aegean font-display text-base">{formatPrice(selectedBooking.total, lang)}</span>} />
                  <Detail label="E-mail" value={<a href={`mailto:${selectedBooking.email}`} className="text-aegean hover:underline">{selectedBooking.email}</a>} />
                  <Detail label={t('Telefon', 'Phone')} value={<a href={`tel:${selectedBooking.phone}`} className="text-aegean hover:underline">{selectedBooking.phone}</a>} />
                </div>

                {selectedBooking.note && (
                  <div className="bg-bone p-4 mb-6 border border-line">
                    <div className="text-[0.65rem] tracking-[0.25em] uppercase text-muted mb-1">{t('Misafir notu', 'Guest note')}</div>
                    <p className="text-sm italic font-display">"{selectedBooking.note}"</p>
                  </div>
                )}

                {selectedBooking.status === 'pending' ? (
                  <div className="border-t border-line pt-6">
                    <label className="block mb-4">
                      <span className="text-[0.7rem] tracking-[0.2em] uppercase text-muted">{t('Misafire not (opsiyonel)', 'Note to guest (optional)')}</span>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={2}
                        placeholder={t('ör. Giriş 14:00, isterseniz erken bagaj bırakın', 'e.g. Check-in 14:00, early luggage drop welcome')}
                        className="mt-2 w-full bg-transparent border-b border-line py-2 outline-none focus:border-terracotta resize-none text-sm"
                      />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleDecide('approved')}
                        className="px-6 py-3 bg-emerald-600 text-white text-[0.78rem] tracking-[0.15em] uppercase hover:bg-emerald-700 transition-colors"
                      >
                        ✓ {t('Onayla', 'Approve')}
                      </button>
                      <button
                        onClick={() => handleDecide('rejected')}
                        className="px-6 py-3 bg-rose-600 text-white text-[0.78rem] tracking-[0.15em] uppercase hover:bg-rose-700 transition-colors"
                      >
                        × {t('Reddet', 'Reject')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-line pt-6">
                    <div className="text-[0.65rem] tracking-[0.25em] uppercase text-muted mb-2">
                      {t('Karar verildi', 'Decided')}
                    </div>
                    {selectedBooking.decidedAt && (
                      <p className="text-sm text-muted mb-3">{formatDate(selectedBooking.decidedAt, lang)}</p>
                    )}
                    {selectedBooking.adminNote && (
                      <div className="bg-bone p-3 border border-line mb-3 text-sm italic font-display">
                        "{selectedBooking.adminNote}"
                      </div>
                    )}
                    <button
                      onClick={() => handleDecide('pending')}
                      className="text-[0.75rem] tracking-[0.15em] uppercase text-aegean hover:text-terracotta"
                    >
                      ← {t('Bekleyene geri al', 'Move back to pending')}
                    </button>
                  </div>
                )}

                <div className="border-t border-line mt-6 pt-4 flex justify-end">
                  <button onClick={handleDelete} className="text-[0.7rem] tracking-[0.15em] uppercase text-rose-600 hover:underline">
                    {t('Sil', 'Delete')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[0.62rem] tracking-[0.25em] uppercase text-muted mb-0.5">{label}</div>
      <div>{value}</div>
    </div>
  );
}

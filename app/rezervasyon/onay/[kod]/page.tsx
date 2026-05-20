'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { rooms, hotelInfo } from '@/lib/data';
import { getBooking, formatDate, formatPrice, type Booking } from '@/lib/booking';
import { useLang } from '@/components/lang/lang-provider';

export default function ConfirmationPage({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = use(params);
  const { t, lang } = useLang();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBooking(getBooking(kod));
    setLoading(false);
  }, [kod]);

  if (loading) {
    return <main className="pt-40 text-center text-muted">…</main>;
  }

  if (!booking) {
    return (
      <main className="pt-32 pb-24 max-w-[800px] mx-auto px-6 md:px-10 text-center">
        <h1 className="section-title">{t('Rezervasyon bulunamadı', 'Reservation not found')}</h1>
        <p className="text-muted mb-8">
          {t(
            'Bu rezervasyon kodu sistemde yok. Belki başka bir tarayıcıda yapıldı.',
            'This reservation code is not in the system. Perhaps it was made in another browser.'
          )}
        </p>
        <Link href="/rezervasyon" className="btn-terracotta">
          {t('Yeni rezervasyon', 'New reservation')}
        </Link>
      </main>
    );
  }

  const room = rooms.find((r) => r.slug === booking.roomSlug)!;
  const waText = encodeURIComponent(
    lang === 'tr'
      ? `Merhaba! ${booking.code} kodlu rezervasyonum hakkında bilgi almak istiyorum.`
      : `Hello! I would like info about my reservation with code ${booking.code}.`
  );
  const waLink = `https://wa.me/${hotelInfo.whatsapp}?text=${waText}`;

  return (
    <main className="pt-32 pb-24 max-w-[1000px] mx-auto px-6 md:px-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta/10 mb-6">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#b65b3c" strokeWidth="2">
            <path d="M6 16 L 14 24 L 26 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="eyebrow inline-block">{t('Rezervasyon onaylandı', 'Reservation confirmed')}</div>
        <h1 className="section-title mx-auto text-center">
          {t('Teşekkürler', 'Thank you')}, <em>{booking.fullName.split(' ')[0]}</em>.
        </h1>
        <p className="text-[1.1rem] leading-relaxed text-muted max-w-[560px] mx-auto">
          {t(
            "Rezervasyon kodunuz aşağıda. Detaylar e-posta adresinize iletildi. Bu bir demodur — gerçek bir e-posta gönderilmez.",
            "Your reservation code is below. Details have been emailed to you. This is a demo — no real email is sent."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 mb-12">
        <div className="bg-cream border border-line">
          <div className="aspect-[16/9] relative bg-aegean overflow-hidden">
            <Image src={room.images[0]} alt={t(room.name.tr, room.name.en)} fill className="object-cover" sizes="(min-width:1024px) 60vw, 100vw" priority />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl mb-1">{t(room.name.tr, room.name.en)}</h2>
                <p className="text-muted">{t(room.tagline.tr, room.tagline.en)}</p>
              </div>
              <div className="text-right">
                <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-1">{t('Kod', 'Code')}</div>
                <div className="font-display text-2xl text-terracotta">{booking.code}</div>
              </div>
            </div>

            <Row label={t('Giriş', 'Check-in')} value={formatDate(booking.checkIn, lang)} />
            <Row label={t('Çıkış', 'Check-out')} value={formatDate(booking.checkOut, lang)} />
            <Row label={t('Gece', 'Nights')} value={`${booking.nights}`} />
            <Row label={t('Misafir', 'Guests')} value={`${booking.guests}`} />
            <Row label={t('Toplam', 'Total')} value={<span className="text-aegean font-display text-2xl">{formatPrice(booking.total, lang)}</span>} />
          </div>
        </div>

        <aside className="bg-ink text-cream p-6 md:p-8">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-cream/50 mb-3">
            {t('Sonraki adım', 'Next step')}
          </div>
          <h3 className="font-display text-2xl mb-4 leading-tight">
            {t('Bir şeyiniz mi var? Bize WhatsApp\'tan ulaşın.', 'Need anything? Reach us on WhatsApp.')}
          </h3>
          <p className="text-cream/70 text-sm mb-6 leading-relaxed">
            {t(
              'Giriş saatiniz, transfer, oda dilekleri için en hızlı yol WhatsApp. 7/24 cevap veriyoruz.',
              'Arrival time, transfers, room preferences — WhatsApp is the fastest. We answer 24/7.'
            )}
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-terracotta block text-center mb-6">
            {t('WhatsApp\'tan yaz', 'Message on WhatsApp')}
          </a>

          <div className="border-t border-cream/20 pt-6 text-sm text-cream/70 space-y-3">
            <div>
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-cream/50 mb-1">{t('Telefon', 'Phone')}</div>
              <div className="font-display text-cream">{hotelInfo.phone}</div>
            </div>
            <div>
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-cream/50 mb-1">E-mail</div>
              <div className="font-display text-cream">{hotelInfo.email}</div>
            </div>
          </div>
        </aside>
      </div>

      <div className="bg-cream border border-line p-6 md:p-8 text-center">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-3">
          {t('Bilgi e-postası', 'Information email')}
        </div>
        <p className="text-muted mb-4 max-w-[600px] mx-auto leading-relaxed">
          {t(
            `${booking.email} adresine rezervasyon detaylarınızı içeren bir e-posta gönderildi. (Demo: gerçek e-posta gönderilmez.)`,
            `An email with your reservation details has been sent to ${booking.email}. (Demo: no real email is sent.)`
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href="/" className="btn-reserve">
            {t('Anasayfa', 'Home')}
          </Link>
          <Link href="/aktiviteler" className="btn-reserve" style={{ background: 'transparent', color: '#1a1d1a', border: '1px solid #1a1d1a' }}>
            {t('Aktiviteleri keşfet', 'Explore activities')}
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between py-3 border-t border-dashed border-line first:border-t-0">
      <span className="text-sm text-muted tracking-wide">{label}</span>
      <span className="font-display text-base text-ink">{value}</span>
    </div>
  );
}

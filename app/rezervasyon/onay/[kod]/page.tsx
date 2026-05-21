'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { rooms, hotelInfo } from '@/lib/data';
import { getBooking, formatDate, formatPrice, onBookingsChange, STATUS_LABELS, type Booking } from '@/lib/booking';
import { useLang } from '@/components/lang/lang-provider';

export default function ConfirmationPage({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = use(params);
  const { t, lang } = useLang();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = () => setBooking(getBooking(kod));
    refresh();
    setLoading(false);
    return onBookingsChange(refresh);
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
  const status = STATUS_LABELS[booking.status];

  const waText = encodeURIComponent(
    lang === 'tr'
      ? `Merhaba! ${booking.code} kodlu rezervasyonum hakkında bilgi almak istiyorum.`
      : `Hello! I would like info about my reservation with code ${booking.code}.`
  );
  const waLink = `https://wa.me/${hotelInfo.whatsapp}?text=${waText}`;

  // Status'a göre başlık/açıklama
  const statusContent = {
    pending: {
      title: t('Talebiniz alındı', 'Request received'),
      sub: t(
        'Müsaitliği kontrol edip 24 saat içinde dönüş yapacağız. Onaylanır onaylanmaz size bildiririz — bu sayfayı açık tutabilirsiniz.',
        "We're checking availability and will get back to you within 24 hours. We'll notify you the moment it's confirmed — you can keep this page open."
      ),
      icon: '⏳',
    },
    approved: {
      title: t('Rezervasyonunuz onaylandı', 'Your reservation is confirmed'),
      sub: t(
        'Sizi bekliyoruz. Giriş saati 14:00, isterseniz daha erken WhatsApp ile haber verin — bagajınızı bahçede bırakabilirsiniz.',
        "We're looking forward to your arrival. Check-in from 14:00 — let us know on WhatsApp if you're earlier, you can leave your luggage in the garden."
      ),
      icon: '✓',
    },
    rejected: {
      title: t('Maalesef bu tarihler dolu', 'Unfortunately fully booked'),
      sub: t(
        'Bu tarihler için odamız kalmadı. Başka tarih denemek ister misiniz? Otelcimiz WhatsApp\'tan alternatif önerebilir.',
        "We're full on these dates. Want to try different ones? Our host can suggest alternatives on WhatsApp."
      ),
      icon: '×',
    },
  }[booking.status];

  return (
    <main className="pt-32 pb-24 max-w-[1000px] mx-auto px-6 md:px-10">
      <div className="text-center mb-12">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border ${status.color} mb-6`}>
          <span className="text-3xl">{statusContent.icon}</span>
        </div>
        <div className={`inline-block text-[0.7rem] tracking-[0.3em] uppercase border px-3 py-1.5 mb-6 ${status.color}`}>
          {t(status.tr, status.en)}
        </div>
        <h1 className="section-title mx-auto text-center">
          {statusContent.title}, <em>{booking.fullName.split(' ')[0]}</em>.
        </h1>
        <p className="text-[1.05rem] leading-relaxed text-muted max-w-[560px] mx-auto">
          {statusContent.sub}
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

            {booking.adminNote && (
              <div className="mt-6 pt-4 border-t border-line">
                <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-2">
                  {t('Otelciden not', 'Note from host')}
                </div>
                <p className="text-sm italic font-display">"{booking.adminNote}"</p>
              </div>
            )}
          </div>
        </div>

        <aside className="bg-ink text-cream p-6 md:p-8">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-cream/50 mb-3">
            {t('Sonraki adım', 'Next step')}
          </div>
          <h3 className="font-display text-2xl mb-4 leading-tight">
            {booking.status === 'rejected'
              ? t('WhatsApp\'tan alternatif sorun', 'Ask for alternatives on WhatsApp')
              : t('Bir şeyiniz mi var? WhatsApp\'tan ulaşın.', 'Need anything? Reach us on WhatsApp.')}
          </h3>
          <p className="text-cream/70 text-sm mb-6 leading-relaxed">
            {t(
              'Giriş saatiniz, transfer, oda dilekleri için en hızlı yol WhatsApp. Yerel aile işletmemiz olarak biz cevap veriyoruz.',
              'Arrival time, transfers, room preferences — WhatsApp is the fastest. As a local family-run hotel, we answer ourselves.'
            )}
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-terracotta block text-center mb-6">
            {t('WhatsApp\'tan yaz', 'Message on WhatsApp')}
          </a>

          <div className="border-t border-cream/20 pt-6 text-sm text-cream/70 space-y-3">
            <div>
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-cream/50 mb-1">{t('Telefon', 'Phone')}</div>
              <div className="font-display text-cream">{hotelInfo.phoneDisplay}</div>
            </div>
            <div>
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-cream/50 mb-1">E-mail</div>
              <div className="font-display text-cream">{hotelInfo.email}</div>
            </div>
            <div>
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-cream/50 mb-1">{t('Adres', 'Address')}</div>
              <div className="font-display text-cream text-sm leading-snug">{t(hotelInfo.address.tr, hotelInfo.address.en)}</div>
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
            `${booking.email} adresine talebinizin özeti gönderildi. Otelci karar verdiğinde ikinci bir bilgilendirme alacaksınız. (Demo: gerçek e-posta gönderilmez — admin panelinden talep durumu canlı güncellenir.)`,
            `A summary of your request has been emailed to ${booking.email}. You'll get a second update when the host decides. (Demo: no real email is sent — request status updates live from the admin panel.)`
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

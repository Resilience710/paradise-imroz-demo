'use client';

import Image from 'next/image';
import { useLang } from '@/components/lang/lang-provider';
import { rooms } from '@/lib/data';
import { formatDate, formatPrice } from '@/lib/booking';
import type { WizardState } from './wizard';

type Props = {
  state: WizardState;
  nights: number;
  total: number;
  onConfirm: () => void;
  onBack: () => void;
};

export function ReviewStep({ state, nights, total, onConfirm, onBack }: Props) {
  const { t, lang } = useLang();
  const room = rooms.find((r) => r.slug === state.roomSlug)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
      <div className="bg-cream border border-line">
        <div className="aspect-[16/9] relative bg-aegean overflow-hidden">
          <Image src={room.images[0]} alt={t(room.name.tr, room.name.en)} fill className="object-cover" sizes="(min-width:1024px) 60vw, 100vw" priority />
        </div>
        <div className="p-6 md:p-8">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-4">{t('Rezervasyon özeti', 'Reservation summary')}</div>
          <h2 className="font-display text-3xl mb-1">{t(room.name.tr, room.name.en)}</h2>
          <p className="text-muted mb-6">{t(room.tagline.tr, room.tagline.en)}</p>

          <Row label={t('Giriş', 'Check-in')} value={formatDate(state.checkIn!.toISOString(), lang)} />
          <Row label={t('Çıkış', 'Check-out')} value={formatDate(state.checkOut!.toISOString(), lang)} />
          <Row label={t('Gece', 'Nights')} value={`${nights}`} />
          <Row label={t('Misafir', 'Guests')} value={`${state.guests}`} />

          <div className="border-t border-line pt-4 mt-4">
            <Row label={t('Ad Soyad', 'Full name')} value={state.fullName} />
            <Row label="E-mail" value={state.email} />
            <Row label={t('Telefon', 'Phone')} value={state.phone} />
            {state.note && <Row label={t('Not', 'Note')} value={state.note} />}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 self-start">
        <div className="bg-ink text-cream p-6 md:p-8">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-cream/50 mb-6">{t('Toplam', 'Total')}</div>

          <div className="flex justify-between mb-2 text-sm text-cream/70">
            <span>{formatPrice(room.pricePerNight, lang)} × {nights} {t('gece', nights === 1 ? 'night' : 'nights')}</span>
            <span>{formatPrice(total, lang)}</span>
          </div>
          <div className="flex justify-between mb-6 text-sm text-cream/70">
            <span>{t('Kahvaltı', 'Breakfast')}</span>
            <span>{t('Dahil', 'Included')}</span>
          </div>

          <div className="border-t border-cream/20 pt-6 mb-8">
            <div className="flex items-baseline justify-between">
              <span>{t('Ödenecek', 'You pay')}</span>
              <span className="font-display text-4xl">{formatPrice(total, lang)}</span>
            </div>
            <div className="text-xs text-cream/50 mt-2">
              {t('Otelde nakit veya kart ile ödeme.', 'Pay at the hotel by cash or card.')}
            </div>
          </div>

          <button onClick={onConfirm} className="btn-terracotta w-full mb-3">
            {t('Rezervasyonu onayla', 'Confirm reservation')}
          </button>
          <button onClick={onBack} className="block w-full text-center text-[0.78rem] tracking-[0.15em] uppercase text-cream/60 hover:text-cream py-2">
            ← {t('Bilgileri düzenle', 'Edit details')}
          </button>
        </div>
        <p className="text-xs text-muted mt-4 px-2">
          {t(
            'Onaylayınca rezervasyon kodunuz hemen üretilir ve e-mail ile size iletilir. Bu bir demodur — gerçek e-mail gönderilmez.',
            "On confirm, your reservation code is generated and emailed to you. This is a demo — no real email is sent."
          )}
        </p>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-display text-base text-ink">{value}</span>
    </div>
  );
}

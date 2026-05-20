'use client';

import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';
import { hotelInfo } from '@/lib/data';

export function ReservationCTA() {
  const { t, lang } = useLang();
  return (
    <section id="reservation" className="bg-ink text-cream px-6 md:px-10 py-32">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-12 lg:gap-20 items-start">
        <Reveal>
          <div className="eyebrow text-terracotta">{t('Rezervasyon', 'Reserve')}</div>
          <h2 className="section-title text-cream">
            {lang === 'tr' ? (
              <>Komisyonsuz, <em className="not-italic italic" style={{ color: 'rgba(245,240,230,0.55)' }}>direkt bizden</em>.</>
            ) : (
              <>No commission, <em className="not-italic italic" style={{ color: 'rgba(245,240,230,0.55)' }}>direct with us</em>.</>
            )}
          </h2>
          <p className="text-[1.05rem] leading-relaxed max-w-[380px]" style={{ color: 'rgba(245,240,230,0.7)' }}>
            {t(
              'Tarih seçin, müsait odalardan birini seçin, rezervasyon kodunuzu hemen alın. Booking ve Otelz fiyatlarına göre direkt bizden ortalama %15 avantaj.',
              'Pick a date, choose an available room, get your reservation code instantly. Direct booking is on average 15% better than Booking or Otelz.'
            )}
          </p>

          <div className="mt-12 pt-8 border-t border-cream/20">
            <Label>{t('Telefon', 'Phone')}</Label>
            <Val>{hotelInfo.phone}</Val>
            <Label>E-mail</Label>
            <Val>{hotelInfo.email}</Val>
            <Label>{t('Adres', 'Address')}</Label>
            <Val>{t(hotelInfo.address.tr, hotelInfo.address.en)}</Val>
          </div>
        </Reveal>

        <Reveal>
          <div className="bg-cream/[0.05] border border-cream/20 p-10">
            <div className="font-display italic text-cream/60 text-lg mb-2">
              {t('Hazır mısınız?', 'Ready?')}
            </div>
            <div className="font-display text-3xl text-cream mb-8 leading-tight">
              {t('Rezervasyon ekranına geçin', 'Continue to reservation')}
            </div>
            <p className="text-cream/70 text-[0.95rem] leading-relaxed mb-10">
              {t(
                '4 adımlı kısa bir akış: tarihler → oda → bilgileriniz → onay. Anında rezervasyon kodu, e-mail ile özet.',
                '4 short steps: dates → room → your details → confirmation. Instant reservation code, summary by email.'
              )}
            </p>
            <Link href="/rezervasyon" className="btn-terracotta inline-block">
              {t('Rezervasyon başlat', 'Start reservation')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.7rem] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(245,240,230,0.5)' }}>
      {children}
    </div>
  );
}
function Val({ children }: { children: React.ReactNode }) {
  return <div className="font-display text-[1.1rem] text-cream mb-6">{children}</div>;
}

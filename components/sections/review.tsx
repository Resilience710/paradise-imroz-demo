'use client';

import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';
import { hotelInfo } from '@/lib/data';

export function Review() {
  const { t } = useLang();
  return (
    <section className="px-6 md:px-10 py-32 text-center bg-cream border-t border-line">
      <Reveal>
        <div className="max-w-[900px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Badge
              top={t("Tripadvisor", 'Tripadvisor')}
              bottom={t("Travelers' Choice", "Travelers' Choice")}
            />
            <Badge
              top="Booking.com"
              bottom={t('Son misafir · 10 / 10', 'Latest guest · 10 / 10')}
            />
            <Badge
              top={t('Genel puan', 'Overall')}
              bottom={`${hotelInfo.rating} / ${hotelInfo.ratingScale}`}
            />
          </div>

          <div className="font-display italic text-7xl text-terracotta leading-[0.5] mb-6">&ldquo;</div>
          <p
            className="font-display font-light italic leading-tight text-ink mb-10"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.01em' }}
          >
            {t(
              'Yeni, tertemiz, ferah odalar. Aile işletmesi olduğu her detayda hissediliyor — Gökçeada\'nın merkezinde böyle sıcak bir yer beklemiyordum.',
              "New, spotless, spacious rooms. You feel it's family-run in every detail — I didn't expect this kind of warmth in the center of Gökçeada."
            )}
          </p>
          <div className="text-[0.78rem] tracking-[0.3em] uppercase text-muted">
            <span className="block w-8 h-px bg-muted mx-auto mb-6" />
            {t('Booking.com · Doğrulanmış konuk', 'Booking.com · Verified guest')}
          </div>
          <div className="mt-8 font-display italic text-aegean text-lg">{hotelInfo.rating} / {hotelInfo.ratingScale}</div>
        </div>
      </Reveal>
    </section>
  );
}

function Badge({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="inline-flex flex-col items-center bg-bone border border-line px-5 py-3 min-w-[150px]">
      <div className="text-[0.6rem] tracking-[0.25em] uppercase text-muted">{top}</div>
      <div className="font-display text-base text-aegean italic mt-0.5">{bottom}</div>
    </div>
  );
}

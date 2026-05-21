'use client';

import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';
import { hotelInfo } from '@/lib/data';

export function Review() {
  const { t, lang } = useLang();
  return (
    <section className="px-5 md:px-10 py-16 md:py-32 text-center bg-cream border-t border-line">
      <Reveal>
        <div className="max-w-[900px] mx-auto">
          <div className="flex flex-wrap items-stretch justify-center gap-4 mb-12">
            <Badge
              big={`${hotelInfo.rating}`}
              top={t(hotelInfo.ratingLabel.tr, hotelInfo.ratingLabel.en)}
              bottom={t(`${hotelInfo.reviewCount} yorum · Hotels.com`, `${hotelInfo.reviewCount} reviews · Hotels.com`)}
            />
            <Badge
              top={t('Tripadvisor', 'Tripadvisor')}
              bottom={t("Travelers' Choice", "Travelers' Choice")}
            />
            <Badge
              top={t('Çiftler', 'Couples')}
              bottom={t('tarafından çok seviliyor', 'love it 10/10')}
            />
            <Badge
              top={t('Bölgede nadir', 'Rare in region')}
              bottom={t('Açık büfe kahvaltı', 'Open buffet breakfast')}
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
            {t('Hotels.com · Doğrulanmış konuk', 'Hotels.com · Verified guest')}
          </div>
          <div className="mt-8 font-display italic text-aegean text-lg">
            {hotelInfo.rating} / {hotelInfo.ratingScale} · {hotelInfo.reviewCount} {t('yorum', 'reviews')}
          </div>
          {lang === 'tr' ? null : null}
        </div>
      </Reveal>
    </section>
  );
}

function Badge({ top, bottom, big }: { top: string; bottom: string; big?: string }) {
  return (
    <div className="inline-flex flex-col items-center bg-bone border border-line px-5 py-3 min-w-[150px]">
      {big && <div className="font-display text-3xl text-aegean leading-none mb-1">{big}</div>}
      <div className="text-[0.6rem] tracking-[0.25em] uppercase text-muted">{top}</div>
      <div className="font-display text-base text-aegean italic mt-0.5 text-center leading-tight">{bottom}</div>
    </div>
  );
}

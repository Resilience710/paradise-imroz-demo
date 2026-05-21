'use client';

import { useEffect, useState } from 'react';
import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';
import { listVisibleReviews, formatReviewDate, onReviewsChange, PARTY_LABELS, type Review } from '@/lib/reviews';
import { hotelInfo } from '@/lib/data';

export function ReviewsStrip() {
  const { t, lang } = useLang();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const r = await listVisibleReviews();
      if (!cancelled) setReviews(r);
    };
    refresh();
    const off = onReviewsChange(refresh);
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  const featured = reviews.slice(0, 6);

  return (
    <section className="bg-aegean-deep text-cream px-5 md:px-10 py-16 md:py-32" id="yorumlar">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-8 items-start lg:items-end mb-10 md:mb-16">
            <div>
              <div className="eyebrow" style={{ color: 'rgba(245, 240, 230, 0.6)' }}>
                {t('Misafirlerimiz', 'Our guests')}
              </div>
              <h2 className="section-title text-cream">
                {lang === 'tr' ? (
                  <>
                    <em style={{ color: 'rgba(245, 240, 230, 0.65)' }}>{hotelInfo.rating}/10</em> · Olağanüstü.
                  </>
                ) : (
                  <>
                    <em style={{ color: 'rgba(245, 240, 230, 0.65)' }}>{hotelInfo.rating}/10</em> · Exceptional.
                  </>
                )}
              </h2>
              <p className="text-base md:text-[1.05rem] leading-relaxed max-w-[600px]" style={{ color: 'rgba(245, 240, 230, 0.75)' }}>
                {t(
                  `${hotelInfo.reviewCount} doğrulanmış misafir yorumu. Aşağıda kendi sözleri — düzenlenmemiş, kısaltılmamış.`,
                  `${hotelInfo.reviewCount} verified guest reviews. Below in their own words — unedited, unabridged.`
                )}
              </p>
            </div>
            <div className="flex lg:flex-col items-baseline lg:items-end gap-3 lg:gap-2">
              <div className="font-display text-5xl lg:text-7xl leading-none">{hotelInfo.rating}</div>
              <div className="text-[0.65rem] md:text-[0.7rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(245,240,230,0.6)' }}>
                {hotelInfo.reviewCount} {t('yorum · Hotels.com', 'reviews · Hotels.com')}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((r) => (
              <ReviewCard key={r.id} review={r} t={t} lang={lang} />
            ))}
          </div>
        </Reveal>

        {reviews.length === 0 && (
          <div className="text-center py-10" style={{ color: 'rgba(245,240,230,0.5)' }}>
            {t('Yorumlar yükleniyor…', 'Loading reviews…')}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review: r, t, lang }: { review: Review; t: (a: string, b: string) => string; lang: 'tr' | 'en' }) {
  const [expanded, setExpanded] = useState(false);
  const body = r.body || '';
  const isLong = body.length > 200;
  const visibleBody = !expanded && isLong ? body.slice(0, 200).trimEnd() + '…' : body;

  return (
    <article className="bg-cream/[0.04] border border-cream/15 p-5 md:p-6 flex flex-col">
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl leading-none text-terracotta">{r.rating}</span>
          <span className="text-[0.65rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(245,240,230,0.55)' }}>
            / 10
          </span>
        </div>
        <span className="text-[0.62rem] tracking-[0.2em] uppercase text-cream/50">
          {formatReviewDate(r.postedDate)}
        </span>
      </div>

      <div className="font-display text-xl text-cream mb-1">{r.guestName}</div>
      {r.traveledWith && (
        <div className="text-[0.7rem] text-cream/55 italic mb-3">{t(PARTY_LABELS[r.traveledWith].tr, PARTY_LABELS[r.traveledWith].en)}</div>
      )}

      {r.bodyTitle && (
        <div className="font-display italic text-cream/90 mb-2">"{r.bodyTitle}"</div>
      )}

      {body && (
        <p className="text-[0.95rem] leading-relaxed text-cream/80 mb-3">
          {visibleBody}
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="ml-2 text-terracotta hover:underline text-xs tracking-wide uppercase">
              {expanded ? t('Daralt', 'Less') : t('Devamı', 'More')}
            </button>
          )}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-cream/15 flex flex-wrap items-center gap-3 text-[0.7rem] tracking-wide text-cream/55">
        {r.stayPeriod && <span>📅 {r.stayPeriod}</span>}
        <span className="ml-auto italic">{t('Doğrulanmış yorum', 'Verified')}</span>
      </div>

      {r.hotelReply && (
        <div className="mt-4 pt-3 border-t border-cream/15 text-xs">
          <div className="text-[0.6rem] tracking-[0.25em] uppercase text-terracotta mb-1">{t('Otelden yanıt', 'Hotel reply')}</div>
          <p className="text-cream/65 italic font-display leading-snug">"{r.hotelReply}"</p>
        </div>
      )}
    </article>
  );
}

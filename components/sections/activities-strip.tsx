'use client';

import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';
import { activities } from '@/lib/data';

export function ActivitiesStrip() {
  const { t, lang } = useLang();
  return (
    <section id="activities" className="bg-aegean-deep text-cream px-6 md:px-10 py-32">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="eyebrow" style={{ color: 'rgba(245, 240, 230, 0.6)' }}>
            {t('Bahçeden çıkarsanız', 'If you leave the garden')}
          </div>
        </Reveal>
        <Reveal>
          <h2 className="section-title text-cream">
            {lang === 'tr' ? (
              <>Adanın <em className="not-italic italic" style={{ color: 'rgba(245, 240, 230, 0.65)' }}>başka şeyleri</em> de var.</>
            ) : (
              <>The island has <em className="not-italic italic" style={{ color: 'rgba(245, 240, 230, 0.65)' }}>other things</em> too.</>
            )}
          </h2>
        </Reveal>
        <Reveal>
          <p className="max-w-[600px] mb-20 text-[1.05rem] leading-relaxed" style={{ color: 'rgba(245, 240, 230, 0.75)' }}>
            {t(
              'Sualtı Milli Parkı, kuzey rüzgarı, taş yollar, balıkçı tekneleri. Otele birkaç dakikadan uzak hiçbir şey yok ve hiçbirini hızlı yapmaya çalışmıyoruz.',
              "An underwater national park, a northerly wind, stone roads, fishing boats. Nothing is more than a few minutes from the hotel, and we're not trying to rush any of it."
            )}
          </p>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-cream/20">
            {activities.map((a, i) => (
              <Link
                key={a.slug}
                href={`/aktiviteler#${a.slug}`}
                className={`p-8 transition-colors hover:bg-cream/[0.04] no-underline ${
                  i < 3 ? 'lg:border-r' : ''
                } ${i < activities.length - 1 ? 'border-b lg:border-b-0 sm:border-r' : ''} ${
                  i === 1 ? 'sm:border-r-0 lg:border-r' : ''
                } border-cream/20`}
              >
                <div className="font-display font-light text-sm text-terracotta mb-12 tracking-wide">{a.num}</div>
                <div className="font-display font-light text-2xl text-cream mb-4 leading-tight">{t(a.title.tr, a.title.en)}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'rgba(245, 240, 230, 0.65)' }}>
                  {t(a.short.tr, a.short.en)}
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

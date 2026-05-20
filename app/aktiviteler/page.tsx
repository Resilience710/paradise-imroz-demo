'use client';

import Image from 'next/image';
import { Reveal } from '@/components/reveal';
import { PageHeader } from '@/components/page-header';
import { useLang } from '@/components/lang/lang-provider';
import { activities } from '@/lib/data';

export default function ActivitiesPage() {
  const { t } = useLang();
  return (
    <main className="pb-24">
      <PageHeader
        eyebrow={{ tr: 'Aktiviteler', en: 'Activities' }}
        title={{
          tr: <>Adanın <em>başka şeyleri</em> de var.</>,
          en: <>The island has <em>other things</em> too.</>,
        }}
        lead={{
          tr: 'Otele birkaç dakikadan uzak hiçbir şey yok. Sualtı milli parkı, kuzey rüzgarı, taş yollar, balıkçı tekneleri. Hiçbirini hızlı yapmaya çalışmıyoruz.',
          en: 'Nothing is more than a few minutes from the hotel. An underwater national park, a northerly wind, stone roads, fishing boats. We are not in a rush.',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-16 md:space-y-28">
        {activities.map((a, i) => (
          <Reveal key={a.slug}>
            <article id={a.slug} className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div className="aspect-[4/3] relative bg-aegean overflow-hidden">
                <Image src={a.image} alt={t(a.title.tr, a.title.en)} fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" />
              </div>
              <div>
                <div className="font-display font-light text-sm text-terracotta mb-4 tracking-wide">{a.num}</div>
                <h2 className="section-title">{t(a.title.tr, a.title.en)}</h2>
                <p className="text-[1.05rem] leading-relaxed mb-4">{t(a.short.tr, a.short.en)}</p>
                <p className="text-[1.05rem] leading-relaxed text-muted">{t(a.long.tr, a.long.en)}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}

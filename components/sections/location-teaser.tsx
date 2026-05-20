'use client';

import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';
import { distances } from '@/lib/data';

export function LocationTeaser() {
  const { t, lang } = useLang();
  return (
    <section id="location" className="bg-cream border-t border-b border-line px-6 md:px-10 py-32">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="eyebrow">{t('Konum', 'Where we are')}</div>
          <h2 className="section-title">
            {lang === 'tr' ? (
              <>Tam <em>ortada</em>. Her şeye yakın, hiçbir şeyin tam içinde değil.</>
            ) : (
              <>Right in the <em>middle</em>. Close to everything, in the middle of nothing.</>
            )}
          </h2>
          <p className="text-[1.1rem] leading-relaxed mb-8 max-w-[460px]">
            {t(
              "Gökçeada Town merkezinde, Fatih Mahallesi'nde. Yürüyerek beş dakikada çarşıda, on dakikada Kalekoy'a yola çıkarsınız.",
              'In the center of Gökçeada Town, Fatih neighborhood. Five minutes walking to the bazaar, ten by car to Kalekoy.'
            )}
          </p>
          <ul className="list-none">
            {distances.map((d) => (
              <li key={d.name.tr} className="grid grid-cols-[auto_1fr_auto] items-baseline py-4 border-b border-dashed border-line gap-6 last:border-b-0">
                <span className="font-display font-light text-xl">{t(d.name.tr, d.name.en)}</span>
                <span className="border-b border-dotted border-line relative -top-1" />
                <span className="font-display italic text-aegean text-[1.05rem]">{t(d.value.tr, d.value.en)}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div
            className="aspect-[4/5] relative overflow-hidden bg-aegean"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&q=85&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-aegean-deep/15 to-aegean-deep/60" />
            <div className="absolute bottom-8 left-8 right-8 text-cream z-10">
              <div className="font-display italic text-2xl mb-1">40.193° N, 25.886° E</div>
              <div className="text-sm opacity-85 tracking-wide">FATIH MAH. · YAŞAR DOĞU SK. NO:7 · GÖKÇEADA</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

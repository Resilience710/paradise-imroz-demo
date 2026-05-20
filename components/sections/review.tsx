'use client';

import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';

export function Review() {
  const { t } = useLang();
  return (
    <section className="px-6 md:px-10 py-32 text-center">
      <Reveal>
        <div className="max-w-[900px] mx-auto">
          <div className="font-display italic text-7xl text-terracotta leading-[0.5] mb-6">&ldquo;</div>
          <p
            className="font-display font-light italic leading-tight text-ink mb-10"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.01em' }}
          >
            {t(
              'Otel çok yeni ve temiz, ilgi alaka mükemmellenecek kadar iyi. Çok merkezi bir konumda arkadaş grubu olarak konaklamamızı sağladık. Her şey çok güzeldi.',
              "The hotel is new and clean, with care so good you can't even fault it. Right in the center, we stayed as a group of friends. Everything was beautiful."
            )}
          </p>
          <div className="text-[0.78rem] tracking-[0.3em] uppercase text-muted">
            <span className="block w-8 h-px bg-muted mx-auto mb-6" />
            {t('Otelz · Doğrulanmış konuk', 'Otelz · Verified guest')}
          </div>
          <div className="mt-8 font-display italic text-aegean text-lg">9.4 / 10</div>
        </div>
      </Reveal>
    </section>
  );
}

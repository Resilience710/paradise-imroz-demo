'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/components/lang/lang-provider';

export function Hero() {
  const { t, lang } = useLang();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden bg-aegean-deep px-6 md:px-10 py-16">
      <div
        className="absolute inset-0 bg-cover transition-transform duration-[8000ms] ease-out"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=2400&q=85&auto=format&fit=crop')",
          backgroundPosition: 'center 40%',
          opacity: 0.7,
          transform: loaded ? 'scale(1)' : 'scale(1.05)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-aegean-deep/30 via-aegean-deep/10 to-aegean-deep/[0.85]" />
      <div className="relative z-10 text-cream max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-8 md:gap-12">
        <div>
          <div className="text-[0.75rem] tracking-[0.4em] uppercase mb-6 opacity-0 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
            <span className="inline-block w-[30px] h-px bg-cream align-middle mr-4" />
            {t('Gökçeada · 8 odalı butik otel', 'Gökçeada · 8-room boutique hotel')}
          </div>
          <h1
            className="font-display font-extralight leading-[0.95] tracking-[-0.03em] mb-6 opacity-0 animate-fadeUp"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', animationDelay: '0.5s' }}
          >
            {lang === 'tr' ? (
              <>
                Sessizliğin<br />
                <em className="italic font-light text-cream/85">kendi adası</em>.
              </>
            ) : (
              <>
                An island that <em className="italic font-light text-cream/85">keeps quiet</em>.
              </>
            )}
          </h1>
          <p className="text-lg max-w-[460px] opacity-0 animate-fadeUp leading-relaxed" style={{ animationDelay: '0.8s' }}>
            {t(
              "Imroz'un ortasında, denizin her tarafından duyulduğu bir bahçede, sekiz oda. Aceleye, gürültüye, kalabalığa yer yok.",
              'Eight rooms in a garden in the middle of Imbros, where the sea can be heard from every side. No place for hurry, noise, or crowds.'
            )}
          </p>
        </div>
        <div
          className="text-[0.8rem] tracking-[0.15em] uppercase opacity-0 animate-fadeUp md:text-right leading-loose"
          style={{ animationDelay: '1s' }}
        >
          <div className="opacity-60 text-[0.7rem]">{t('40° 11′ K · 25° 53′ D', '40° 11′ N · 25° 53′ E')}</div>
          <div>{t('Mayıs · Ekim arası', 'May · October season')}</div>
          <div>{t('Yeni misafirler için', 'For new arrivals')}</div>
        </div>
      </div>
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream text-[0.7rem] tracking-[0.3em] uppercase opacity-0 animate-fadeUp z-10"
        style={{ animationDelay: '1.3s' }}
      >
        {t('Aşağıya', 'Scroll')}
        <span className="block w-px h-10 bg-cream mt-3 mx-auto" />
      </div>
    </section>
  );
}

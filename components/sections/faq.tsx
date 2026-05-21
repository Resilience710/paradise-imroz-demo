'use client';

import { useState } from 'react';
import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';
import { faqs } from '@/lib/data';

export function FAQ() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-6 md:px-10 py-32 bg-bone border-t border-line">
      <div className="max-w-[1000px] mx-auto">
        <Reveal>
          <div className="eyebrow">{t('Sıkça Sorulan Sorular', 'FAQ')}</div>
          <h2 className="section-title mb-4">
            {lang === 'tr' ? (
              <>Gelmeden önce <em>aklınızda kalanlar</em>.</>
            ) : (
              <>What's <em>on your mind</em> before you come.</>
            )}
          </h2>
          <p className="text-muted text-[1.05rem] leading-relaxed mb-12 max-w-[600px]">
            {t(
              "Booking, Hotels.com ve TripAdvisor'da misafirlerimizin en sık sorduğu sorular. Cevap aradığınız bir şey yoksa WhatsApp veya e-posta ile bize ulaşın.",
              'The questions guests ask most often on Booking, Hotels.com and TripAdvisor. If your question is not here, reach us on WhatsApp or email.'
            )}
          </p>
        </Reveal>

        <Reveal>
          <ul className="divide-y divide-line border-y border-line">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={i}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full grid grid-cols-[1fr_auto] items-baseline gap-6 py-5 text-left hover:text-aegean transition-colors group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg md:text-xl leading-snug pr-4">
                      {t(f.q.tr, f.q.en)}
                    </span>
                    <span
                      className={`text-terracotta text-2xl font-light transition-transform duration-200 ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 text-ink/85 text-[1.02rem] leading-relaxed max-w-[700px]">
                        {t(f.a.tr, f.a.en)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

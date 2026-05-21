'use client';

import { Reveal } from '@/components/reveal';
import { useLang } from '@/components/lang/lang-provider';

export function Story() {
  const { t, lang } = useLang();
  return (
    <section id="story" className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-8 md:gap-10 lg:gap-20 items-start">
        <Reveal>
          <div className="eyebrow">{t('Hikaye', 'The story')}</div>
          <h2 className="section-title">
            {lang === 'tr' ? (
              <>
                Imroz'dan <em>Gökçeada'ya</em>, isim değişti ada kalır.
              </>
            ) : (
              <>
                From Imbros to <em>Gökçeada</em>, the name changed, the island stayed.
              </>
            )}
          </h2>
          <p className="font-display font-light italic text-xl md:text-2xl leading-tight text-aegean mb-6 md:mb-8 max-w-[540px]">
            {t(
              '"Adanın merkezindeyiz ama merkezde değiliz. Bu çelişki bizim en güzel tarafımız."',
              '"We\'re in the center of the island, but not in any center. That contradiction is our best side."'
            )}
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-5 md:mb-6 max-w-[540px]">
            {t(
              "Paradise İmroz, Gökçeada Fatih Mahallesi'nde, 2023'te yerel bir adalı ailenin açtığı butik otel. İki taş bloka yayılmış sekiz süit — her biri 40 m², müstakil girişli, ahşap balkonlu.",
              'Paradise İmroz is a boutique hotel in Gökçeada\'s Fatih neighborhood, opened in 2023 by a local island family. Eight suites across two stone blocks — each 40 m², with a private entrance and a wooden balcony.'
            )}
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-5 md:mb-6 max-w-[540px]">
            {t(
              "Ada eski adıyla Imbros'tu. Bir dönem İmroz oldu. Sonra Gökçeada. İsimler değişti, ada hiç değişmedi. Sessiz kaldı, yeşil kaldı, denizin dibi hâlâ görünüyor — biz de o havayı bu sekiz odada tutmaya çalışıyoruz.",
              "The island was once Imbros, then İmroz, now Gökçeada. The names changed, the island didn't — still quiet, still green, the seabed still visible. We try to hold that feeling inside these eight rooms."
            )}
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-line mt-10">
            <Stat num="8" label={t('Süit · 40m²', 'Suites · 40m²')} />
            <Stat num="2" label={t('Taş blok', 'Stone blocks')} />
            <Stat num={<>5<span className="text-2xl align-super">′</span></>} label={t('Merkeze yürüyüş', 'To town center')} />
            <Stat num={<>9.4<span className="text-2xl">/10</span></>} label={t('Hotels.com · 39 yorum', 'Hotels.com · 39 reviews')} />
          </div>
        </Reveal>

        <Reveal>
          <div className="bg-cream p-6 md:p-8 border border-line lg:sticky lg:top-24">
            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-6">
              {t("Bugün Gökçeada'da", 'Today in Gökçeada')}
            </div>
            <div className="font-display font-extralight text-5xl md:text-6xl leading-none mb-2">22°</div>
            <div className="font-display italic text-muted mb-8">
              {t('açık, hafif kuzey rüzgarı', 'clear, light northerly breeze')}
            </div>
            <Row label={t('Deniz', 'Sea')} value="21°" />
            <Row label={t('Rüzgar', 'Wind')} value="12 km/h" />
            <Row label={t('Gün batımı', 'Sunset')} value="20:34" />
            <Row label={t('Sörf koşulları', 'Surf conditions')} value={<span className="text-terracotta">{t('İyi', 'Good')}</span>} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ num, label }: { num: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="font-display font-light text-5xl text-aegean leading-none mb-1.5">{num}</div>
      <div className="text-[0.78rem] tracking-[0.18em] uppercase text-muted">{label}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 border-t border-dashed border-line text-sm">
      <span>{label}</span>
      <span className="text-muted">{value}</span>
    </div>
  );
}

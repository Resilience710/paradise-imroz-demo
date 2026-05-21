'use client';

import { Reveal } from '@/components/reveal';
import { PageHeader } from '@/components/page-header';
import { useLang } from '@/components/lang/lang-provider';
import { distances, hotelInfo, nearbyPlaces } from '@/lib/data';

export default function LocationPage() {
  const { t } = useLang();
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=25.83%2C40.165%2C25.94%2C40.22&layer=mapnik&marker=${hotelInfo.coords.lat}%2C${hotelInfo.coords.lng}`;

  return (
    <main className="pb-24">
      <PageHeader
        eyebrow={{ tr: 'Konum', en: 'Where we are' }}
        title={{
          tr: <>Tam <em>ortada</em>. Her şeye yakın, hiçbir şeyin tam içinde değil.</>,
          en: <>Right in the <em>middle</em>. Close to everything, in the middle of nothing.</>,
        }}
        lead={{
          tr: "Gökçeada Town merkezinde, Fatih Mahallesi'nde. Yürüyerek beş dakikada çarşıda, on dakikada Kalekoy'a.",
          en: 'In the center of Gökçeada Town, Fatih neighborhood. Five minutes walking to the bazaar, ten by car to Kalekoy.',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 mb-16">
        <Reveal>
          <div className="aspect-[16/10] bg-aegean border border-line overflow-hidden">
            <iframe
              src={mapSrc}
              className="w-full h-full"
              loading="lazy"
              title="Paradise Imroz haritada"
            />
          </div>
          <a
            href={`https://www.openstreetmap.org/?mlat=${hotelInfo.coords.lat}&mlon=${hotelInfo.coords.lng}#map=15/${hotelInfo.coords.lat}/${hotelInfo.coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-[0.78rem] tracking-[0.15em] uppercase text-aegean hover:text-terracotta"
          >
            {t('Haritada büyük gör', 'Open larger map')} →
          </a>
        </Reveal>

        <Reveal>
          <div className="bg-cream border border-line p-6 md:p-8">
            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-3">{t('Adres', 'Address')}</div>
            <p className="font-display text-xl mb-6 leading-snug">{t(hotelInfo.address.tr, hotelInfo.address.en)}</p>

            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-3">{t('Koordinat', 'Coordinates')}</div>
            <p className="font-display italic text-aegean mb-6">{hotelInfo.coords.lat}° N, {hotelInfo.coords.lng}° E</p>

            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-3">{t('İletişim', 'Contact')}</div>
            <p className="font-display text-lg mb-1">{hotelInfo.phone}</p>
            <p className="font-display text-lg mb-6">{hotelInfo.email}</p>

            <a
              href={`https://wa.me/${hotelInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-terracotta inline-block"
            >
              {t("WhatsApp'tan ulaş", 'Reach us on WhatsApp')}
            </a>
          </div>
        </Reveal>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="border-t border-line pt-12">
            <h2 className="section-title">{t('Mesafeler', 'Distances')}</h2>
          </div>
        </Reveal>
        <Reveal>
          <ul className="list-none max-w-[800px]">
            {distances.map((d) => (
              <li key={d.name.tr} className="grid grid-cols-[1fr_auto] items-baseline py-5 border-b border-dashed border-line">
                <span className="font-display font-light text-xl">{t(d.name.tr, d.name.en)}</span>
                <span className="font-display italic text-aegean text-[1.05rem]">{t(d.value.tr, d.value.en)}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              title={t('Feribot', 'Ferry')}
              body={t(
                'Kabatepe (Çanakkale) — Kuzu Limanı (Gökçeada). Yaz aylarında günlük 4-6 sefer, 1.5 saat. Araba ile gelinebilir.',
                'Kabatepe (Çanakkale) — Kuzu Harbor (Gökçeada). 4-6 daily ferries in summer, 1.5 hours. Cars welcome.'
              )}
            />
            <InfoCard
              title={t('Uçak', 'Plane')}
              body={t(
                "Çanakkale Havalimanı'ndan transfer ayarlayabiliriz. İlk olarak Kabatepe feribotuna geçilir.",
                'We can arrange transfers from Çanakkale Airport. The first step is to take the Kabatepe ferry.'
              )}
            />
            <InfoCard
              title={t('Adada ulaşım', 'On the island')}
              body={t(
                'Bisiklet otelde ücretsiz. Otomobil kiralama için anlaştığımız yerel firma var.',
                'Bicycles are free at the hotel. We work with a local car rental.'
              )}
            />
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-20 pt-12 border-t border-line">
            <div className="eyebrow">{t('Yakında', 'Nearby')}</div>
            <h2 className="section-title">{t('Yürüme mesafesinde sevdiğimiz yerler', 'Walking-distance favourites')}</h2>
            <p className="text-muted text-[1.05rem] leading-relaxed max-w-[640px] mb-10">
              {t(
                "Adanın merkezinde 3-6 dakikalık yürüyüşle ulaşılan, bizim de sık gittiğimiz birkaç yer.",
                "A few of our own favourites, all 3-6 minutes' walk in the town center."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {nearbyPlaces.map((p) => (
                <div key={p.name} className="bg-cream border border-line p-5 flex items-start gap-4">
                  <div className="font-display text-aegean text-3xl leading-none mt-1">
                    {p.rating?.toFixed(1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-display text-xl">{p.name}</h3>
                      {p.walkMin && (
                        <span className="text-[0.65rem] tracking-[0.2em] uppercase text-muted whitespace-nowrap">
                          {p.walkMin} {t('dk', 'min')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted tracking-wide uppercase mb-2">
                      {t(p.category.tr, p.category.en)}
                    </div>
                    {p.note && (
                      <p className="text-sm leading-relaxed text-ink/80">
                        {t(p.note.tr, p.note.en)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-cream border border-line p-6">
      <h3 className="font-display text-xl mb-3">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

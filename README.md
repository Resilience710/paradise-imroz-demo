# Paradise Imroz · Butik Otel Demo (v2)

Gökçeada / Paradise Imroz butik oteli için Next.js 15 + TypeScript + Tailwind ile yapılmış, "tam sistem hissi" veren bir demo site. Backend yok — tüm veri ve booking akışı tarayıcıda mock.

> Önceki tek dosyalık tasarım [demo-v1.html](demo-v1.html) adıyla referans olarak saklandı.

## Yerelde Çalıştırma

```bash
npm install
cp .env.local.example .env.local  # değerleri doldur
npm run dev
# → http://localhost:3000
```

İlk başlatma birkaç dakika sürer (Google Fonts indirir). Build:

```bash
npm run build && npm start
```

## Supabase / Env Variables

| Anahtar | Değer | Açıklama |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://raazmkfsrbtvnwcmhgws.supabase.co` | Client + server tarafında kullanılır |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon JWT) | RLS ile public erişim |
| `SUPABASE_SERVICE_ROLE_KEY` | (service_role JWT) | Sadece API route'larda; admin işlemleri için |
| `ADMIN_PASSWORD_HASH` | `8c697...a918` | Admin şifresinin SHA-256 hex'i. Default: `admin` |

**Vercel'e deploy ederken** Settings → Environment Variables sekmesinden bu 4 değişkeni ekle (Production + Preview + Development hepsine).

Şifreyi değiştirmek için:
```bash
echo -n "yenisifre" | sha256sum
```
çıkan hex'i hem `.env.local`'e hem `Vercel`'e koy.

## Vercel'e Deploy

### En kolay yöntem — Vercel CLI
```bash
npm i -g vercel
vercel        # ilk seferde GitHub/email ile login
```
İlk soruda **Y**, proje ismine `paradise-imroz` deyin. ~1 dakika sonra `https://paradise-imroz-xxx.vercel.app` linki gelir.

### GitHub üzerinden
1. Klasörü bir GitHub reposu olarak push edin
2. https://vercel.com/new → Import → repoyu seç
3. Build settings: Next.js otomatik algılar, dokunmayın
4. Deploy

Hiçbir env var gerekmez (demo). Vercel free tier yeterli.

## Site Yapısı

| Rota | Açıklama |
|---|---|
| `/` | Anasayfa — uzun scroll, mevcut editöryel tasarım |
| `/odalar` | 8 odanın grid görünümü, fiyat ve donanım |
| `/odalar/[slug]` | Tek oda detayı: galeri, donanım, "rezerve et" |
| `/rezervasyon` | 4 adımlı booking wizard: tarih → oda → bilgi → onay |
| `/rezervasyon/onay/[kod]` | Onay sayfası, rez. kodu, WhatsApp CTA |
| `/galeri` | Lightbox'lu masonry foto galeri |
| `/aktiviteler` | Dalış, sörf, bisiklet, balıkçılık detayları |
| `/konum` | OpenStreetMap embed + mesafeler + ulaşım |

Tüm sayfalarda TR/EN dil toggle (sağ üst), tercih `localStorage`'a kaydedilir.

## Booking Akışı — Demo Notları

1. **Tarihler** — Çift takvim, Mayıs–Ekim arası önerilir. Bloke tarihler `lib/mock-bookings.ts`'de.
2. **Oda** — Seçilen tarihte müsait odalar listelenir. Dolu olanlar ayrı bölümde gri.
3. **Bilgiler** — Ad, e-mail, telefon, misafir sayısı, not. Validation aktif.
4. **Onay** — Toplam fiyat özeti, "Onayla" → `PRD-XXXX` kod üretilir, `localStorage`'a kaydedilir, onay sayfasına yönlendirilir.

Demo notu: Hiçbir backend yok. E-mail gönderilmez (onay sayfasında bildirilir). WhatsApp CTA gerçek bir `wa.me` linki üretir.

## Otelci Beğendiyse Sıradakiler

Final için eklenecekler (yeni v3):
- Gerçek booking backend: Supabase Postgres + admin paneli
- E-mail: Resend ile rezervasyon bildirimi
- Payment: iyzico veya Stripe (opsiyonel; bizim model komisyon yerine ödeme)
- Domain: paradiseimroz.com bağlantısı + SSL (Vercel otomatik)
- SEO: meta etiketler, sitemap, robots, Schema.org Hotel JSON-LD
- Görseller: oteldeki gerçek fotoğraflar (Unsplash placeholder'ları değişir)
- Google Analytics + Search Console
- Canlı hava durumu API (şu an mock 22°)

## Mock Veri

8 oda hardcoded `lib/data.ts`'de — gerçek isimler: Zeytin, Mersin, Lavanta, Defne, Adaçayı, Çam, Funda, Mavi. Fiyatlar 2400–4200 TRY arası. Otelci fiyatları söylerse `data.ts` tek dosyadan güncellenir.

Bloke tarihler `lib/mock-bookings.ts`'de örnek olarak doldurulmuş — gerçek booking sistemi gelince bu dosya silinir.

## Tech Stack

- **Next.js 15.5** (App Router) + **React 19**
- **TypeScript** strict
- **Tailwind CSS 3.4** — custom palette: bone/cream/ink/aegean/terracotta
- **Fraunces** (display) + **DM Sans** (body) — next/font ile self-host
- **react-day-picker 9** — booking takvimi
- **react-hook-form + zod** — form validation
- **OpenStreetMap embed** — gerçek harita (Google Maps key gerektirmez)

Tüm bağımlılıklar ~112 paket, ilk build 60sn. Production bundle anasayfa 122 KB, booking wizard 165 KB.

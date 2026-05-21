'use client';

import { useEffect, useState } from 'react';
import { listAllReviews, upsertReview, deleteReview, onReviewsChange, formatReviewDate, PARTY_LABELS, type Review, type TravelParty } from '@/lib/reviews';
import { useLang } from '@/components/lang/lang-provider';

type Editing = Partial<Review> & { _new?: boolean };

const EMPTY: Editing = {
  _new: true,
  rating: 10,
  guestName: '',
  traveledWith: null,
  postedDate: new Date().toISOString().slice(0, 10),
  stayPeriod: '',
  bodyTitle: '',
  body: '',
  liked: '',
  hotelReply: '',
  replyDate: '',
  sortOrder: 0,
  visible: true,
};

export default function AdminReviewsPage() {
  const { t } = useLang();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const r = await listAllReviews();
      if (!cancelled) setReviews(r);
    };
    refresh();
    const off = onReviewsChange(refresh);
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  const startNew = () => setEditing(EMPTY);
  const startEdit = (r: Review) => setEditing({ ...r });
  const cancel = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    if (!editing.guestName?.trim()) {
      alert(t('Misafir adı gerekli', 'Guest name required'));
      return;
    }
    setBusy(true);
    await upsertReview({
      id: editing._new ? undefined : editing.id,
      rating: editing.rating,
      guestName: editing.guestName,
      traveledWith: editing.traveledWith ?? null,
      postedDate: editing.postedDate,
      stayPeriod: editing.stayPeriod || null,
      bodyTitle: editing.bodyTitle || null,
      body: editing.body || null,
      liked: editing.liked || null,
      hotelReply: editing.hotelReply || null,
      replyDate: editing.replyDate || null,
      sortOrder: editing.sortOrder ?? 0,
      visible: editing.visible ?? true,
    });
    setBusy(false);
    setEditing(null);
  };

  const toggleVisible = async (r: Review) => {
    await upsertReview({ id: r.id, visible: !r.visible });
  };

  const remove = async (r: Review) => {
    if (!confirm(t(`"${r.guestName}" adlı misafirin yorumunu silmek istiyor musun?`, `Delete review by ${r.guestName}?`))) return;
    await deleteReview(r.id);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-2">{t('İçerik', 'Content')}</div>
          <h1 className="font-display text-4xl">{t('Yorumlar', 'Reviews')}</h1>
          <p className="text-muted text-sm mt-2">
            {t(
              "Anasayfada gösterilen misafir yorumlarını yönet. Eklediklerin anında siteye yansır.",
              'Manage guest reviews shown on the homepage. Changes appear instantly on the site.'
            )}
          </p>
        </div>
        <button onClick={startNew} className="btn-terracotta">
          + {t('Yeni yorum ekle', 'Add new review')}
        </button>
      </div>

      <div className="bg-cream border border-line divide-y divide-line">
        {reviews.length === 0 && (
          <div className="p-10 text-center text-muted">{t('Henüz yorum yok.', 'No reviews yet.')}</div>
        )}
        {reviews.map((r) => (
          <article key={r.id} className={`p-5 ${!r.visible ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-center">
                <div className="font-display text-3xl text-terracotta leading-none">{r.rating}</div>
                <div className="text-[0.55rem] tracking-[0.2em] uppercase text-muted">/ 10</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h3 className="font-display text-xl">{r.guestName}</h3>
                  <span className="text-[0.65rem] tracking-[0.2em] uppercase text-muted whitespace-nowrap">
                    {formatReviewDate(r.postedDate)}
                  </span>
                </div>
                {r.traveledWith && (
                  <div className="text-xs text-muted italic mb-2">{t(PARTY_LABELS[r.traveledWith].tr, PARTY_LABELS[r.traveledWith].en)}</div>
                )}
                {r.bodyTitle && <div className="font-display italic text-aegean mb-1">"{r.bodyTitle}"</div>}
                {r.body && <p className="text-sm leading-relaxed text-ink/80 mb-2 line-clamp-3">{r.body}</p>}
                {r.stayPeriod && <div className="text-xs text-muted mb-2">📅 {r.stayPeriod}</div>}
                {r.hotelReply && (
                  <div className="text-xs text-aegean italic mt-2">↳ {r.hotelReply}</div>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                <span className={`text-[0.6rem] tracking-[0.2em] uppercase px-2 py-1 border ${r.visible ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-line text-muted bg-bone'}`}>
                  {r.visible ? t('Yayında', 'Visible') : t('Gizli', 'Hidden')}
                </span>
                <div className="flex gap-2 text-[0.65rem] tracking-[0.2em] uppercase">
                  <button onClick={() => startEdit(r)} className="text-aegean hover:text-terracotta">{t('Düzenle', 'Edit')}</button>
                  <button onClick={() => toggleVisible(r)} className="text-muted hover:text-ink">
                    {r.visible ? t('Gizle', 'Hide') : t('Göster', 'Show')}
                  </button>
                  <button onClick={() => remove(r)} className="text-rose-600 hover:underline">{t('Sil', 'Delete')}</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-ink/70 z-[200] flex items-start justify-center overflow-y-auto p-6" onClick={cancel}>
          <div onClick={(e) => e.stopPropagation()} className="bg-bone border border-line w-full max-w-2xl mt-20 mb-10">
            <header className="flex items-baseline justify-between px-6 py-4 border-b border-line">
              <h2 className="font-display text-2xl">
                {editing._new ? t('Yeni yorum', 'New review') : t('Yorumu düzenle', 'Edit review')}
              </h2>
              <button onClick={cancel} className="text-muted hover:text-ink text-xl">×</button>
            </header>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('Puan (1-10)', 'Rating (1-10)')}>
                <input type="number" min={1} max={10} value={editing.rating ?? 10} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} className="input" />
              </Field>
              <Field label={t('Misafir adı', 'Guest name')}>
                <input type="text" value={editing.guestName ?? ''} onChange={(e) => setEditing({ ...editing, guestName: e.target.value })} className="input" />
              </Field>
              <Field label={t('Yayın tarihi', 'Posted date')}>
                <input type="date" value={editing.postedDate ?? ''} onChange={(e) => setEditing({ ...editing, postedDate: e.target.value })} className="input" />
              </Field>
              <Field label={t('Seyahat türü', 'Travel party')}>
                <select value={editing.traveledWith ?? ''} onChange={(e) => setEditing({ ...editing, traveledWith: (e.target.value || null) as TravelParty })} className="input">
                  <option value="">— {t('seçilmedi', 'unspecified')} —</option>
                  <option value="family">{t('Aile', 'Family')}</option>
                  <option value="couple">{t('Çift', 'Couple')}</option>
                  <option value="solo">{t('Yalnız', 'Solo')}</option>
                  <option value="friends">{t('Arkadaşlar', 'Friends')}</option>
                  <option value="business">{t('İş', 'Business')}</option>
                </select>
              </Field>
              <Field label={t('Konaklama özeti', 'Stay period')} full>
                <input type="text" placeholder="Ağustos 2024 · 3 gece" value={editing.stayPeriod ?? ''} onChange={(e) => setEditing({ ...editing, stayPeriod: e.target.value })} className="input" />
              </Field>
              <Field label={t('Başlık (opsiyonel)', 'Title (optional)')} full>
                <input type="text" value={editing.bodyTitle ?? ''} onChange={(e) => setEditing({ ...editing, bodyTitle: e.target.value })} className="input" />
              </Field>
              <Field label={t('Yorum metni', 'Body')} full>
                <textarea rows={4} value={editing.body ?? ''} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="input resize-y" />
              </Field>
              <Field label={t('Beğendiği yönler (virgülle)', 'Liked aspects (comma-sep.)')} full>
                <input type="text" placeholder="temizlik, personel ve servis, oda konforu" value={editing.liked ?? ''} onChange={(e) => setEditing({ ...editing, liked: e.target.value })} className="input" />
              </Field>
              <Field label={t('Otelden yanıt', 'Hotel reply')} full>
                <textarea rows={2} value={editing.hotelReply ?? ''} onChange={(e) => setEditing({ ...editing, hotelReply: e.target.value })} className="input resize-y" />
              </Field>
              <Field label={t('Yanıt tarihi', 'Reply date')}>
                <input type="date" value={editing.replyDate ?? ''} onChange={(e) => setEditing({ ...editing, replyDate: e.target.value })} className="input" />
              </Field>
              <Field label={t('Sıralama (küçük = üstte)', 'Sort order (lower = higher)')}>
                <input type="number" value={editing.sortOrder ?? 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} className="input" />
              </Field>
              <Field label={t('Yayında mı', 'Visible')} full>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={editing.visible ?? true} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
                  {t('Sitede görünür', 'Visible on site')}
                </label>
              </Field>
            </div>
            <footer className="px-6 py-4 border-t border-line flex justify-end gap-3">
              <button onClick={cancel} className="text-[0.75rem] tracking-[0.15em] uppercase text-muted hover:text-ink">{t('İptal', 'Cancel')}</button>
              <button onClick={save} disabled={busy} className="btn-terracotta disabled:opacity-50">
                {busy ? t('Kaydediliyor…', 'Saving…') : t('Kaydet', 'Save')}
              </button>
            </footer>
            <style jsx>{`
              .input {
                background: transparent;
                border: none;
                border-bottom: 1px solid #d8cfbd;
                padding: 0.5rem 0;
                color: #1a1d1a;
                font-size: 0.95rem;
                outline: none;
                width: 100%;
              }
              .input:focus { border-color: #b65b3c; }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`flex flex-col ${full ? 'sm:col-span-2' : ''}`}>
      <label className="text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">{label}</label>
      {children}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { rooms as staticRooms, type Room } from '@/lib/data';
import { fetchRoomSettings, mergeRoom, saveRoomSettings, uploadRoomImage, onRoomsChange } from '@/lib/rooms';
import {
  listAllBlocks,
  createBlock,
  deleteBlock,
  onBlocksChange,
  formatBlockRange,
  BLOCK_SOURCE_LABELS,
  type BlockSource,
  type RoomBlock,
} from '@/lib/blocks';
import { listBookings, onBookingsChange, formatShortDate, formatPrice, type Booking } from '@/lib/booking';
import { useLang } from '@/components/lang/lang-provider';

export default function AdminRoomsPage() {
  const { t, lang } = useLang();
  const [merged, setMerged] = useState<Room[]>(staticRooms);
  const [blocks, setBlocks] = useState<RoomBlock[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  const refresh = async () => {
    const [s, b, bk] = await Promise.all([fetchRoomSettings(), listAllBlocks(), listBookings()]);
    setMerged(staticRooms.map((r) => mergeRoom(r, s.find((o) => o.slug === r.slug))));
    setBlocks(b);
    setBookings(bk);
  };

  useEffect(() => {
    refresh();
    const off1 = onRoomsChange(refresh);
    const off2 = onBlocksChange(refresh);
    const off3 = onBookingsChange(refresh);
    return () => {
      off1();
      off2();
      off3();
    };
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const roomData = useMemo(() => {
    return merged.map((room) => {
      const approved = bookings.filter((b) => b.roomSlug === room.slug && b.status === 'approved');
      const pending = bookings.filter((b) => b.roomSlug === room.slug && b.status === 'pending');
      const roomBlocks = blocks.filter((b) => b.roomSlug === room.slug);
      const upcoming = [...approved, ...pending]
        .filter((b) => new Date(b.checkOut) >= today)
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
      const upcomingBlocks = roomBlocks
        .filter((b) => new Date(b.to) >= today)
        .sort((a, b) => a.from.localeCompare(b.from));
      const currentlyOccupied =
        approved.some((b) => new Date(b.checkIn) <= today && new Date(b.checkOut) > today) ||
        roomBlocks.some((b) => new Date(b.from) <= today && new Date(b.to) > today);
      return { room, approved, pending, upcoming, upcomingBlocks, currentlyOccupied };
    });
  }, [merged, bookings, blocks]);

  const occupiedCount = roomData.filter((r) => r.currentlyOccupied).length;
  const availableCount = staticRooms.length - occupiedCount;

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-between items-baseline gap-4">
        <div>
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-2">{t('Envanter', 'Inventory')}</div>
          <h1 className="font-display text-4xl">{t('Odalar', 'Rooms')}</h1>
          <p className="text-muted text-sm mt-2">
            {t(
              'Her odanın fiyatını, fotoğraflarını ve manuel dolu tarihlerini buradan yönet. Hotels.com ya da Booking üzerinden gelen rezervasyonları buraya ekleyince site rezervasyonunda da dolu görünür.',
              "Edit each room's price, photos, and manual blocked dates. When you add a Hotels.com / Booking reservation here, the site will mark the room as taken."
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <span className="text-sm px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300">
            {availableCount} {t('müsait', 'available')}
          </span>
          <span className="text-sm px-3 py-1.5 bg-rose-100 text-rose-900 border border-rose-300">
            {occupiedCount} {t('dolu', 'occupied')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomData.map(({ room, approved, pending, upcoming, upcomingBlocks, currentlyOccupied }) => (
          <div key={room.slug} className="bg-cream border border-line overflow-hidden flex flex-col">
            <div className="aspect-[16/10] relative bg-aegean">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={room.images[0]} alt={t(room.name.tr, room.name.en)} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-[0.62rem] tracking-[0.15em] uppercase bg-ink text-cream px-2 py-1">
                  Blok {room.block}
                </span>
                <span
                  className={`text-[0.62rem] tracking-[0.15em] uppercase px-2 py-1 ${
                    currentlyOccupied ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {currentlyOccupied ? t('Şu an dolu', 'In-house') : t('Müsait', 'Available')}
                </span>
              </div>
              <button
                onClick={() => setEditing(room.slug)}
                className="absolute top-3 right-3 bg-cream/95 text-ink text-[0.65rem] tracking-[0.15em] uppercase px-3 py-1.5 hover:bg-cream"
              >
                {t('Düzenle', 'Edit')} →
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-display text-2xl">{t(room.name.tr, room.name.en)}</h3>
                <div className="text-xs text-muted">{room.size}m² · {room.capacity}p</div>
              </div>
              <p className="text-sm text-muted mb-4">{t(room.tagline.tr, room.tagline.en)}</p>

              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <Mini label={t('Onaylı', 'Approved')} value={approved.length} />
                <Mini label={t('Bloklu', 'Blocked')} value={upcomingBlocks.length} accent="text-rose-600" />
                <Mini label={t('Gece', 'Night')} value={formatPrice(room.pricePerNight, lang)} compact />
              </div>

              <div className="border-t border-line pt-3 flex-1">
                <div className="text-[0.62rem] tracking-[0.25em] uppercase text-muted mb-2">
                  {t('Yaklaşan dolu tarihler', 'Upcoming blocks')}
                </div>
                {upcomingBlocks.length === 0 && upcoming.length === 0 ? (
                  <p className="text-xs text-muted py-2">{t('Yaklaşan yok.', 'None upcoming.')}</p>
                ) : (
                  <ul className="space-y-1.5">
                    {upcomingBlocks.slice(0, 3).map((b) => (
                      <li key={b.id} className="flex items-baseline justify-between text-xs gap-2">
                        <span className={`text-[0.58rem] tracking-wide uppercase px-1.5 py-0.5 border ${BLOCK_SOURCE_LABELS[b.source].color}`}>
                          {t(BLOCK_SOURCE_LABELS[b.source].tr, BLOCK_SOURCE_LABELS[b.source].en)}
                        </span>
                        <span className="text-muted ml-auto whitespace-nowrap">
                          {formatShortDate(b.from, lang)} → {formatShortDate(b.to, lang)}
                        </span>
                      </li>
                    ))}
                    {upcoming.slice(0, 2).map((b) => (
                      <li key={b.code} className="flex items-baseline justify-between text-xs gap-2">
                        <span className="text-aegean truncate">{b.fullName}</span>
                        <span className="text-muted whitespace-nowrap ml-2">
                          {formatShortDate(b.checkIn, lang)} → {formatShortDate(b.checkOut, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <RoomEditModal
          slug={editing}
          onClose={() => setEditing(null)}
          allBlocks={blocks.filter((b) => b.roomSlug === editing)}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

function Mini({ label, value, accent, compact }: { label: string; value: React.ReactNode; accent?: string; compact?: boolean }) {
  return (
    <div className="bg-bone py-2">
      <div className="text-[0.55rem] tracking-[0.2em] uppercase text-muted">{label}</div>
      <div className={`font-display ${compact ? 'text-sm' : 'text-xl'} ${accent || ''}`}>{value}</div>
    </div>
  );
}

// =========================================================
// Edit modal
// =========================================================

function RoomEditModal({
  slug,
  onClose,
  allBlocks,
  t,
  lang,
}: {
  slug: string;
  onClose: () => void;
  allBlocks: RoomBlock[];
  t: (a: string, b: string) => string;
  lang: 'tr' | 'en';
}) {
  const base = staticRooms.find((r) => r.slug === slug)!;
  const [merged, setMerged] = useState<Room>(base);
  const [price, setPrice] = useState<string>(String(base.pricePerNight));
  const [images, setImages] = useState<string[]>(base.images);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Block form
  const [bForm, setBForm] = useState<{ from: string; to: string; source: BlockSource; guestName: string; note: string }>({
    from: '',
    to: '',
    source: 'hotels.com',
    guestName: '',
    note: '',
  });
  const [bBusy, setBBusy] = useState(false);

  useEffect(() => {
    fetchRoomSettings().then((s) => {
      const override = s.find((o) => o.slug === slug);
      const m = mergeRoom(base, override);
      setMerged(m);
      setPrice(String(m.pricePerNight));
      setImages(m.images);
    });
  }, [slug, base]);

  const savePrice = async () => {
    const num = Number(price);
    if (!Number.isFinite(num) || num < 0) return;
    await saveRoomSettings(slug, { pricePerNight: num });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const url = await uploadRoomImage(slug, file);
      if (url) uploadedUrls.push(url);
    }
    if (uploadedUrls.length > 0) {
      const next = [...images, ...uploadedUrls];
      setImages(next);
      await saveRoomSettings(slug, { customImages: next });
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = async (url: string) => {
    if (!confirm(t('Bu fotoğrafı kaldırmak istiyor musun?', 'Remove this photo?'))) return;
    const next = images.filter((u) => u !== url);
    setImages(next);
    await saveRoomSettings(slug, { customImages: next });
  };

  const resetImages = async () => {
    if (!confirm(t('Tüm yüklenen fotoğraflar silinecek, varsayılana dönülecek. Emin misin?', 'All uploaded photos will be cleared, defaults restored. Sure?'))) return;
    setImages(base.images);
    await saveRoomSettings(slug, { customImages: [] });
  };

  const addBlock = async () => {
    if (!bForm.from || !bForm.to) {
      alert(t('Tarihler gerekli', 'Dates required'));
      return;
    }
    setBBusy(true);
    await createBlock({
      roomSlug: slug,
      from: bForm.from,
      to: bForm.to,
      source: bForm.source,
      guestName: bForm.guestName || undefined,
      note: bForm.note || undefined,
    });
    setBBusy(false);
    setBForm({ from: '', to: '', source: 'hotels.com', guestName: '', note: '' });
  };

  const remove = async (id: string) => {
    if (!confirm(t('Bu blok silinsin mi?', 'Delete this block?'))) return;
    await deleteBlock(id);
  };

  return (
    <div className="fixed inset-0 bg-ink/70 z-[200] flex items-start justify-center overflow-y-auto p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-bone border border-line w-full max-w-3xl mt-20 mb-10">
        <header className="flex items-baseline justify-between px-6 py-4 border-b border-line">
          <div>
            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted">{t('Düzenle', 'Edit')}</div>
            <h2 className="font-display text-2xl">{t(merged.name.tr, merged.name.en)}</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl">×</button>
        </header>

        {/* PRICE */}
        <section className="px-6 py-5 border-b border-line">
          <h3 className="font-display text-lg mb-3">{t('Fiyat', 'Price')}</h3>
          <div className="flex items-baseline gap-3">
            <div className="flex items-baseline border-b border-line py-1">
              <span className="text-muted mr-1">₺</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-transparent text-2xl font-display text-aegean outline-none w-32"
              />
            </div>
            <span className="text-sm text-muted">/ {t('gece', 'night')}</span>
            <button onClick={savePrice} className="ml-auto text-[0.7rem] tracking-[0.2em] uppercase bg-ink text-cream px-4 py-2 hover:bg-aegean">
              {t('Fiyatı kaydet', 'Save price')}
            </button>
          </div>
          <p className="text-xs text-muted mt-2">
            {t(`Varsayılan: ${formatPrice(base.pricePerNight, lang)}`, `Default: ${formatPrice(base.pricePerNight, lang)}`)}
          </p>
        </section>

        {/* IMAGES */}
        <section className="px-6 py-5 border-b border-line">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="font-display text-lg">{t('Fotoğraflar', 'Photos')}</h3>
            <div className="flex gap-3 text-[0.7rem] tracking-[0.2em] uppercase">
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="text-aegean hover:text-terracotta disabled:opacity-50">
                + {t('Foto ekle', 'Add photos')}
              </button>
              <button onClick={resetImages} className="text-muted hover:text-rose-600">
                {t('Varsayılana sıfırla', 'Reset to defaults')}
              </button>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url) => (
              <div key={url} className="relative aspect-[4/3] bg-aegean overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(url)}
                  className="absolute top-2 right-2 bg-rose-600 text-white text-[0.6rem] tracking-[0.15em] uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {t('Kaldır', 'Remove')}
                </button>
              </div>
            ))}
            {uploading && (
              <div className="aspect-[4/3] border-2 border-dashed border-terracotta flex items-center justify-center text-terracotta text-xs tracking-wide uppercase animate-pulse">
                {t('Yükleniyor…', 'Uploading…')}
              </div>
            )}
          </div>
        </section>

        {/* BLOCKS */}
        <section className="px-6 py-5">
          <h3 className="font-display text-lg mb-3">{t('Dolu tarihler', 'Blocked dates')}</h3>

          {allBlocks.length === 0 ? (
            <p className="text-sm text-muted mb-4">{t('Hiç bloklu tarih yok.', 'No blocks yet.')}</p>
          ) : (
            <ul className="divide-y divide-line bg-cream border border-line mb-4">
              {allBlocks.map((b) => (
                <li key={b.id} className="flex items-baseline gap-3 px-4 py-3 text-sm">
                  <span className={`text-[0.58rem] tracking-wide uppercase px-1.5 py-0.5 border ${BLOCK_SOURCE_LABELS[b.source].color}`}>
                    {t(BLOCK_SOURCE_LABELS[b.source].tr, BLOCK_SOURCE_LABELS[b.source].en)}
                  </span>
                  <span className="font-display text-aegean whitespace-nowrap">{formatBlockRange(b, lang)}</span>
                  {b.guestName && <span className="text-muted truncate">· {b.guestName}</span>}
                  {b.note && <span className="text-muted italic truncate">· {b.note}</span>}
                  <button onClick={() => remove(b.id)} className="ml-auto text-rose-600 hover:underline text-[0.65rem] tracking-[0.2em] uppercase">
                    {t('Sil', 'Delete')}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="bg-cream border border-line p-4">
            <div className="text-[0.65rem] tracking-[0.25em] uppercase text-muted mb-3">{t('Yeni dolu tarih ekle', 'Add new block')}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label={t('Giriş', 'From')}>
                <input type="date" value={bForm.from} onChange={(e) => setBForm({ ...bForm, from: e.target.value })} className="input" />
              </Field>
              <Field label={t('Çıkış', 'To')}>
                <input type="date" value={bForm.to} onChange={(e) => setBForm({ ...bForm, to: e.target.value })} className="input" />
              </Field>
              <Field label={t('Kaynak', 'Source')}>
                <select value={bForm.source} onChange={(e) => setBForm({ ...bForm, source: e.target.value as BlockSource })} className="input">
                  <option value="hotels.com">Hotels.com</option>
                  <option value="booking.com">Booking.com</option>
                  <option value="phone">{t('Telefon', 'Phone')}</option>
                  <option value="walk-in">{t('Yerinden', 'Walk-in')}</option>
                  <option value="external">{t('Diğer platform', 'Other OTA')}</option>
                  <option value="manual">{t('Manuel', 'Manual')}</option>
                </select>
              </Field>
              <Field label={t('Misafir adı (ops.)', 'Guest name (opt.)')}>
                <input type="text" value={bForm.guestName} onChange={(e) => setBForm({ ...bForm, guestName: e.target.value })} className="input" />
              </Field>
              <Field label={t('Not (ops.)', 'Note (opt.)')} full>
                <input type="text" value={bForm.note} onChange={(e) => setBForm({ ...bForm, note: e.target.value })} className="input" placeholder={t('ör. 4 kişi · 2 gece kahvaltılı', 'e.g. 4 ppl · 2N w/ breakfast')} />
              </Field>
            </div>
            <button onClick={addBlock} disabled={bBusy} className="btn-terracotta disabled:opacity-50">
              {bBusy ? t('Ekleniyor…', 'Adding…') : t('+ Dolu tarih ekle', '+ Add block')}
            </button>
          </div>
        </section>

        <footer className="px-6 py-4 border-t border-line flex justify-end">
          <button onClick={onClose} className="text-[0.75rem] tracking-[0.15em] uppercase text-muted hover:text-ink">{t('Kapat', 'Close')}</button>
        </footer>

        <style jsx>{`
          .input {
            background: transparent;
            border: none;
            border-bottom: 1px solid #d8cfbd;
            padding: 0.4rem 0;
            color: #1a1d1a;
            font-size: 0.95rem;
            outline: none;
            width: 100%;
          }
          .input:focus { border-color: #b65b3c; }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-[0.62rem] tracking-[0.2em] uppercase text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}

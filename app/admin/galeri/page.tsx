'use client';

import { useEffect, useRef, useState } from 'react';
import {
  listAllPhotos,
  uploadPhoto,
  deletePhoto,
  updatePhoto,
  onPhotosChange,
  categoryLabels,
  type Photo,
  type PhotoCategory,
} from '@/lib/photos';
import { useLang } from '@/components/lang/lang-provider';

export default function AdminGalleryPage() {
  const { t, lang } = useLang();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const all = await listAllPhotos();
      if (!cancelled) setPhotos(all);
    };
    refresh();
    const off = onPhotosChange(refresh);
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const arr = Array.from(files);
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      if (!file.type.startsWith('image/')) continue;
      setProgress(`${i + 1} / ${arr.length} · ${file.name}`);
      await uploadPhoto(file);
    }
    setUploading(false);
    setProgress('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDelete = async (p: Photo) => {
    if (p.source === 'static') {
      alert(t('Statik fotoğraflar buradan silinemez.', 'Static photos cannot be deleted here.'));
      return;
    }
    if (!confirm(t('Bu fotoğrafı silmek istiyor musun?', 'Delete this photo?'))) return;
    await deletePhoto(p.id, p.storagePath);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const statics = photos.filter((p) => p.source === 'static');
  const uploads = photos.filter((p) => p.source === 'admin');

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-2">{t('İçerik', 'Content')}</div>
          <h1 className="font-display text-4xl">{t('Galeri', 'Gallery')}</h1>
          <p className="text-muted text-sm mt-2">
            {t(
              'Otelin gerçek fotoğraflarını buradan yönet. Tüm fotoğraflar Supabase\'de saklanır — her cihazda aynı görünür.',
              'Manage real hotel photos here. All photos live in Supabase — visible on every device.'
            )}
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-terracotta disabled:opacity-50"
        >
          {uploading ? progress || t('Yükleniyor…', 'Uploading…') : t('Fotoğraf ekle', 'Add photos')}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed mb-10 p-10 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-terracotta bg-terracotta/5' : 'border-line bg-cream hover:bg-bone'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <div className="font-display text-2xl mb-2">
          {dragOver ? t('Bırak!', 'Drop!') : t('Fotoğrafları buraya sürükle', 'Drag photos here')}
        </div>
        <div className="text-sm text-muted">
          {t(
            'veya yukarıdaki butona tıkla · birden fazla seçebilirsin · Supabase Storage\'a yüklenir',
            'or click the button above · select multiple · uploaded to Supabase Storage'
          )}
        </div>
      </div>

      {/* Static photos */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl">{t('Statik fotoğraflar', 'Static photos')}</h2>
          <span className="text-[0.7rem] tracking-[0.2em] uppercase text-muted">
            {statics.length} {t('adet · siteyle deploy olur', 'photos · deployed with site')}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {statics.map((p) => (
            <PhotoCard key={p.id} photo={p} editing={false} onEdit={() => {}} onSave={() => {}} onDelete={() => {}} lang={lang} t={t} readonly />
          ))}
        </div>
      </section>

      {/* Admin uploads */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl">{t('Yüklenenler', 'Uploads')}</h2>
          <span className="text-[0.7rem] tracking-[0.2em] uppercase text-muted">
            {uploads.length} {t('adet · Supabase Storage', 'photos · Supabase Storage')}
          </span>
        </div>
        {uploads.length === 0 ? (
          <div className="bg-cream border border-line p-10 text-center text-muted">
            {t("Henüz yüklenmiş fotoğraf yok.", 'No uploads yet.')}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploads.map((p) => (
              <PhotoCard
                key={p.id}
                photo={p}
                editing={editing === p.id}
                onEdit={() => setEditing(editing === p.id ? null : p.id)}
                onSave={async (patch) => {
                  await updatePhoto(p.id, patch);
                  setEditing(null);
                }}
                onDelete={() => handleDelete(p)}
                lang={lang}
                t={t}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PhotoCard({
  photo,
  editing,
  onEdit,
  onSave,
  onDelete,
  lang,
  t,
  readonly,
}: {
  photo: Photo;
  editing: boolean;
  onEdit: () => void;
  onSave: (patch: { altTr?: string; altEn?: string; category?: PhotoCategory }) => void;
  onDelete: () => void;
  lang: 'tr' | 'en';
  t: (tr: string, en: string) => string;
  readonly?: boolean;
}) {
  const [altTr, setAltTr] = useState(photo.alt.tr);
  const [altEn, setAltEn] = useState(photo.alt.en);
  const [cat, setCat] = useState<PhotoCategory>(photo.category);

  return (
    <div className="bg-cream border border-line overflow-hidden">
      <div className="aspect-[4/3] relative bg-aegean">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={t(photo.alt.tr, photo.alt.en)} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-3">
        {editing ? (
          <div className="space-y-2">
            <input
              value={altTr}
              onChange={(e) => setAltTr(e.target.value)}
              placeholder="Başlık (TR)"
              className="w-full text-xs bg-bone border border-line px-2 py-1 outline-none focus:border-terracotta"
            />
            <input
              value={altEn}
              onChange={(e) => setAltEn(e.target.value)}
              placeholder="Caption (EN)"
              className="w-full text-xs bg-bone border border-line px-2 py-1 outline-none focus:border-terracotta"
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value as PhotoCategory)}
              className="w-full text-xs bg-bone border border-line px-2 py-1 outline-none"
            >
              {(Object.keys(categoryLabels) as PhotoCategory[]).map((k) => (
                <option key={k} value={k}>{t(categoryLabels[k].tr, categoryLabels[k].en)}</option>
              ))}
            </select>
            <div className="flex justify-between gap-2 mt-2">
              <button
                onClick={() => onSave({ altTr, altEn, category: cat })}
                className="text-[0.65rem] tracking-[0.2em] uppercase bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700"
              >
                {t('Kaydet', 'Save')}
              </button>
              <button onClick={onEdit} className="text-[0.65rem] tracking-[0.2em] uppercase text-muted hover:text-ink">
                {t('İptal', 'Cancel')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-[0.62rem] tracking-[0.25em] uppercase text-terracotta mb-1">
              {t(categoryLabels[photo.category].tr, categoryLabels[photo.category].en)}
            </div>
            <div className="text-xs text-ink leading-tight mb-3 min-h-[2em]">{t(photo.alt.tr, photo.alt.en)}</div>
            {!readonly && (
              <div className="flex justify-between text-[0.62rem] tracking-[0.2em] uppercase">
                <button onClick={onEdit} className="text-aegean hover:text-terracotta">{t('Düzenle', 'Edit')}</button>
                <button onClick={onDelete} className="text-rose-600 hover:underline">{t('Sil', 'Delete')}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

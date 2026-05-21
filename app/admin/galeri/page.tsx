'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  staticPhotos,
  listAdminPhotos,
  addAdminPhoto,
  deleteAdminPhoto,
  updateAdminPhoto,
  onPhotosChange,
  fileToCompressedDataURL,
  newPhotoId,
  categoryLabels,
  type Photo,
  type PhotoCategory,
} from '@/lib/photos';
import { useLang } from '@/components/lang/lang-provider';

export default function AdminGalleryPage() {
  const { t, lang } = useLang();
  const [adminPhotos, setAdminPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refresh = () => setAdminPhotos(listAdminPhotos());
    refresh();
    return onPhotosChange(refresh);
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const arr = Array.from(files);
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      if (!file.type.startsWith('image/')) continue;
      setProgress(`${i + 1} / ${arr.length} · ${file.name}`);
      try {
        const dataUrl = await fileToCompressedDataURL(file);
        addAdminPhoto({
          id: newPhotoId(),
          src: dataUrl,
          alt: { tr: file.name.replace(/\.[^.]+$/, ''), en: file.name.replace(/\.[^.]+$/, '') },
          category: 'diger',
          source: 'admin',
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error('Upload failed', e);
      }
    }
    setUploading(false);
    setProgress('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    if (!confirm(t('Bu fotoğrafı silmek istiyor musun?', 'Delete this photo?'))) return;
    deleteAdminPhoto(id);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-2">{t('İçerik', 'Content')}</div>
          <h1 className="font-display text-4xl">{t('Galeri', 'Gallery')}</h1>
          <p className="text-muted text-sm mt-2">
            {t(
              'Otelin gerçek fotoğraflarını buradan yönet. Statik fotoğraflar siteyle birlikte deploy edilir, sen yüklediklerin sadece bu tarayıcıda saklanır (demo).',
              'Manage real hotel photos here. Static ones deploy with the site; your uploads live in this browser (demo).'
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
            'veya yukarıdaki butona tıkla · birden fazla seçebilirsin · max 1600px\'e küçültülür',
            "or click the button above · select multiple · resized to max 1600px"
          )}
        </div>
      </div>

      {/* Statik fotoğraflar */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl">{t('Statik fotoğraflar', 'Static photos')}</h2>
          <span className="text-[0.7rem] tracking-[0.2em] uppercase text-muted">
            {staticPhotos.length} {t('adet · siteyle deploy olur', 'photos · deployed with site')}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {staticPhotos.map((p) => (
            <div key={p.id} className="bg-cream border border-line overflow-hidden">
              <div className="aspect-[4/3] relative bg-aegean">
                <Image src={p.src} alt={t(p.alt.tr, p.alt.en)} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="p-3">
                <div className="text-[0.62rem] tracking-[0.25em] uppercase text-terracotta mb-1">
                  {t(categoryLabels[p.category].tr, categoryLabels[p.category].en)}
                </div>
                <div className="text-xs text-ink leading-tight">{t(p.alt.tr, p.alt.en)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin uploads */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl">{t('Yüklediklerin', 'Your uploads')}</h2>
          <span className="text-[0.7rem] tracking-[0.2em] uppercase text-muted">
            {adminPhotos.length} {t('adet · sadece bu tarayıcı', 'photos · this browser only')}
          </span>
        </div>
        {adminPhotos.length === 0 ? (
          <div className="bg-cream border border-line p-10 text-center text-muted">
            {t('Henüz yüklediğin fotoğraf yok.', 'You haven\'t uploaded any photos yet.')}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {adminPhotos.map((p) => (
              <PhotoCard
                key={p.id}
                photo={p}
                editing={editing === p.id}
                onEdit={() => setEditing(editing === p.id ? null : p.id)}
                onSave={(patch) => {
                  updateAdminPhoto(p.id, patch);
                  setEditing(null);
                }}
                onDelete={() => handleDelete(p.id)}
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
}: {
  photo: Photo;
  editing: boolean;
  onEdit: () => void;
  onSave: (patch: Partial<Photo>) => void;
  onDelete: () => void;
  lang: 'tr' | 'en';
  t: (tr: string, en: string) => string;
}) {
  const [altTr, setAltTr] = useState(photo.alt.tr);
  const [altEn, setAltEn] = useState(photo.alt.en);
  const [cat, setCat] = useState<PhotoCategory>(photo.category);

  return (
    <div className="bg-cream border border-line overflow-hidden">
      <div className="aspect-[4/3] relative bg-aegean">
        {/* admin uploads are base64 data URLs — use plain img to avoid next/image domain rules */}
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
                onClick={() => onSave({ alt: { tr: altTr, en: altEn }, category: cat })}
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
            <div className="flex justify-between text-[0.62rem] tracking-[0.2em] uppercase">
              <button onClick={onEdit} className="text-aegean hover:text-terracotta">{t('Düzenle', 'Edit')}</button>
              <button onClick={onDelete} className="text-rose-600 hover:underline">{t('Sil', 'Delete')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

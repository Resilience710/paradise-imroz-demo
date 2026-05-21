// Foto yönetimi — statik (public/photos) + admin upload (localStorage base64)

export type PhotoCategory = 'oda' | 'kahvalti' | 'cephe' | 'bahce' | 'manzara' | 'diger';

export const categoryLabels: Record<PhotoCategory, { tr: string; en: string }> = {
  oda: { tr: 'Oda', en: 'Room' },
  kahvalti: { tr: 'Kahvaltı', en: 'Breakfast' },
  cephe: { tr: 'Cephe', en: 'Facade' },
  bahce: { tr: 'Bahçe', en: 'Garden' },
  manzara: { tr: 'Manzara', en: 'View' },
  diger: { tr: 'Diğer', en: 'Other' },
};

export type Photo = {
  id: string;
  src: string;           // /photos/foo.jpg veya data:image/jpeg;base64,...
  alt: { tr: string; en: string };
  category: PhotoCategory;
  source: 'static' | 'admin';
  createdAt?: string;    // sadece admin için
};

// Otelin gerçek fotoğrafları — public/photos/'a kullanıcı yerleştirdi
export const staticPhotos: Photo[] = [
  {
    id: 'static-cephe-gece',
    src: '/photos/cephe-gece.png',
    alt: { tr: 'Otel cephesi · gece · taş bina ahşap balkon', en: 'Hotel facade · night · stone & wood balcony' },
    category: 'cephe',
    source: 'static',
  },
  {
    id: 'static-kahvalti',
    src: '/photos/kahvalti.png',
    alt: { tr: 'Esnek kahvaltı · liman manzarası', en: 'Flexible breakfast · harbour view' },
    category: 'kahvalti',
    source: 'static',
  },
  {
    id: 'static-suit-1',
    src: '/photos/suit-1.png',
    alt: { tr: 'Süit · oturma odası', en: 'Suite · living area' },
    category: 'oda',
    source: 'static',
  },
  {
    id: 'static-suit-2',
    src: '/photos/suit-2.png',
    alt: { tr: 'Süit · ahşap sürgülü kapı · yatak odası geçişi', en: 'Suite · wooden sliding doors · bedroom view' },
    category: 'oda',
    source: 'static',
  },
  {
    id: 'static-suit-3',
    src: '/photos/suit-3.png',
    alt: { tr: 'Süit · oturma + pencere', en: 'Suite · sitting area & window' },
    category: 'oda',
    source: 'static',
  },
];

const STORAGE_KEY = 'paradise-imroz-photos';

export function listAdminPhotos(): Photo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Photo[]) : [];
  } catch {
    return [];
  }
}

export function listAllPhotos(): Photo[] {
  return [...staticPhotos, ...listAdminPhotos()];
}

export function addAdminPhoto(p: Photo) {
  if (typeof window === 'undefined') return;
  const all = listAdminPhotos();
  all.push(p);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  emit();
}

export function deleteAdminPhoto(id: string) {
  if (typeof window === 'undefined') return;
  const all = listAdminPhotos().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  emit();
}

export function updateAdminPhoto(id: string, patch: Partial<Photo>) {
  if (typeof window === 'undefined') return;
  const all = listAdminPhotos();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  emit();
}

function emit() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('photos-changed'));
}

export function onPhotosChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('photos-changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('photos-changed', handler);
    window.removeEventListener('storage', handler);
  };
}

export function newPhotoId(): string {
  return 'admin-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

// Resmi base64'e çevir + olabildiğince küçült (max 1600px en, jpeg 0.82)
export async function fileToCompressedDataURL(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Resmi yükle
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });

  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (w <= maxDim && h <= maxDim && file.size < 600_000) return dataUrl;

  const scale = Math.min(maxDim / w, maxDim / h, 1);
  const cw = Math.round(w * scale);
  const ch = Math.round(h * scale);
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, cw, ch);
  return canvas.toDataURL('image/jpeg', quality);
}

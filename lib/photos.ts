import { supabase, type DBPhoto } from './supabase';

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
  src: string;
  alt: { tr: string; en: string };
  category: PhotoCategory;
  source: 'static' | 'admin';
  sortOrder: number;
  storagePath: string;
};

function fromDB(row: DBPhoto): Photo {
  return {
    id: row.id,
    src: row.url,
    alt: { tr: row.alt_tr, en: row.alt_en },
    category: row.category,
    source: row.storage_path.startsWith('static/') ? 'static' : 'admin',
    sortOrder: row.sort_order,
    storagePath: row.storage_path,
  };
}

export async function listAllPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.error('listAllPhotos', error);
    return [];
  }
  return (data as DBPhoto[]).map(fromDB);
}

export async function deletePhoto(id: string, storagePath: string) {
  const res = await fetch('/api/admin/photos/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, storagePath }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('deletePhoto', err);
  }
  notifyChange();
}

export async function updatePhoto(id: string, patch: { altTr?: string; altEn?: string; category?: PhotoCategory }) {
  const res = await fetch('/api/admin/photos/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...patch }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('updatePhoto', err);
  }
  notifyChange();
}

export async function uploadPhoto(file: File): Promise<Photo | null> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/admin/photos/upload', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('uploadPhoto', err);
    return null;
  }
  const data = await res.json();
  notifyChange();
  return data as Photo;
}

function notifyChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('photos-changed'));
}

export function onPhotosChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('photos-changed', handler);
  const channel = supabase
    .channel('photos-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => handler())
    .subscribe();
  return () => {
    window.removeEventListener('photos-changed', handler);
    supabase.removeChannel(channel);
  };
}

import { rooms as staticRooms, type Room } from './data';
import { supabase } from './supabase';

export type RoomSettings = {
  slug: string;
  pricePerNight: number | null;
  customImages: string[];
  updatedAt: string;
};

type DBRoomSettings = {
  slug: string;
  price_per_night: number | null;
  custom_images: string[] | null;
  updated_at: string;
};

export async function fetchRoomSettings(): Promise<RoomSettings[]> {
  const { data, error } = await supabase.from('room_settings').select('*');
  if (error || !data) return [];
  return (data as DBRoomSettings[]).map((r) => ({
    slug: r.slug,
    pricePerNight: r.price_per_night,
    customImages: Array.isArray(r.custom_images) ? r.custom_images : [],
    updatedAt: r.updated_at,
  }));
}

export function mergeRoom(base: Room, override?: RoomSettings): Room {
  if (!override) return base;
  return {
    ...base,
    pricePerNight: override.pricePerNight ?? base.pricePerNight,
    images: override.customImages.length > 0 ? override.customImages : base.images,
  };
}

export async function getRoomsAsync(): Promise<Room[]> {
  const overrides = await fetchRoomSettings();
  return staticRooms.map((r) => mergeRoom(r, overrides.find((o) => o.slug === r.slug)));
}

export async function getRoomAsync(slug: string): Promise<Room | null> {
  const base = staticRooms.find((r) => r.slug === slug);
  if (!base) return null;
  const { data } = await supabase.from('room_settings').select('*').eq('slug', slug).maybeSingle();
  if (!data) return base;
  return mergeRoom(base, {
    slug,
    pricePerNight: (data as DBRoomSettings).price_per_night,
    customImages: Array.isArray((data as DBRoomSettings).custom_images) ? (data as DBRoomSettings).custom_images! : [],
    updatedAt: (data as DBRoomSettings).updated_at,
  });
}

export async function saveRoomSettings(slug: string, patch: { pricePerNight?: number | null; customImages?: string[] }) {
  const res = await fetch('/api/admin/rooms/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ slug, ...patch }),
  });
  if (!res.ok) console.error('saveRoomSettings', await res.text());
  notify();
}

export async function uploadRoomImage(slug: string, file: File): Promise<string | null> {
  const form = new FormData();
  form.append('file', file);
  form.append('slug', slug);
  const res = await fetch('/api/admin/rooms/images/upload', {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) {
    console.error('uploadRoomImage', await res.text());
    return null;
  }
  const data = await res.json();
  notify();
  return data.url as string;
}

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('rooms-changed'));
}

export function onRoomsChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('rooms-changed', handler);
  const channel = supabase
    .channel('rooms-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'room_settings' }, () => handler())
    .subscribe();
  return () => {
    window.removeEventListener('rooms-changed', handler);
    supabase.removeChannel(channel);
  };
}

import { supabase } from './supabase';

export type BlockSource = 'manual' | 'hotels.com' | 'booking.com' | 'external' | 'phone' | 'walk-in';

export type RoomBlock = {
  id: string;
  roomSlug: string;
  from: string;     // YYYY-MM-DD
  to: string;       // YYYY-MM-DD (exclusive)
  source: BlockSource;
  guestName: string | null;
  note: string | null;
  createdAt: string;
};

type DBRoomBlock = {
  id: string;
  room_slug: string;
  from_date: string;
  to_date: string;
  source: string;
  guest_name: string | null;
  note: string | null;
  created_at: string;
};

function fromDB(r: DBRoomBlock): RoomBlock {
  return {
    id: r.id,
    roomSlug: r.room_slug,
    from: r.from_date,
    to: r.to_date,
    source: r.source as BlockSource,
    guestName: r.guest_name,
    note: r.note,
    createdAt: r.created_at,
  };
}

export async function listRoomBlocks(roomSlug?: string): Promise<RoomBlock[]> {
  let q = supabase.from('room_blocks').select('*').order('from_date', { ascending: true });
  if (roomSlug) q = q.eq('room_slug', roomSlug);
  const { data, error } = await q;
  if (error || !data) return [];
  return (data as DBRoomBlock[]).map(fromDB);
}

export async function listAllBlocks(): Promise<RoomBlock[]> {
  return listRoomBlocks();
}

// Returns rooms that have no overlapping booking or block in [from, to)
export async function checkAvailability(from: Date, to: Date): Promise<Set<string>> {
  const fromIso = from.toISOString().slice(0, 10);
  const toIso = to.toISOString().slice(0, 10);

  // Active bookings (pending/approved both block availability)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('room_slug, check_in, check_out, status')
    .in('status', ['pending', 'approved'])
    .lt('check_in', toIso)
    .gt('check_out', fromIso);

  // Manual blocks
  const { data: blocks } = await supabase
    .from('room_blocks')
    .select('room_slug, from_date, to_date')
    .lt('from_date', toIso)
    .gt('to_date', fromIso);

  const unavailable = new Set<string>();
  (bookings || []).forEach((b: any) => unavailable.add(b.room_slug));
  (blocks || []).forEach((b: any) => unavailable.add(b.room_slug));

  return unavailable;
}

export async function isRoomAvailableAsync(slug: string, from: Date, to: Date): Promise<boolean> {
  const unavailable = await checkAvailability(from, to);
  return !unavailable.has(slug);
}

export async function createBlock(b: {
  roomSlug: string;
  from: string;
  to: string;
  source: BlockSource;
  guestName?: string;
  note?: string;
}) {
  const res = await fetch('/api/admin/rooms/blocks/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(b),
  });
  if (!res.ok) console.error('createBlock', await res.text());
  notify();
}

export async function deleteBlock(id: string) {
  const res = await fetch('/api/admin/rooms/blocks/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id }),
  });
  if (!res.ok) console.error('deleteBlock', await res.text());
  notify();
}

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('blocks-changed'));
}

export function onBlocksChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('blocks-changed', handler);
  const channel = supabase
    .channel('blocks-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'room_blocks' }, () => handler())
    .subscribe();
  return () => {
    window.removeEventListener('blocks-changed', handler);
    supabase.removeChannel(channel);
  };
}

export const BLOCK_SOURCE_LABELS: Record<BlockSource, { tr: string; en: string; color: string }> = {
  manual: { tr: 'Manuel', en: 'Manual', color: 'bg-stone-100 text-stone-800 border-stone-300' },
  'hotels.com': { tr: 'Hotels.com', en: 'Hotels.com', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  'booking.com': { tr: 'Booking.com', en: 'Booking.com', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  external: { tr: 'Diğer platform', en: 'Other OTA', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  phone: { tr: 'Telefon', en: 'Phone', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  'walk-in': { tr: 'Yerinden', en: 'Walk-in', color: 'bg-teal-100 text-teal-900 border-teal-300' },
};

export function formatBlockRange(b: RoomBlock, lang: 'tr' | 'en'): string {
  const f = new Date(b.from);
  const t = new Date(b.to);
  const fmt = (d: Date) => d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: '2-digit', month: 'short' });
  return `${fmt(f)} → ${fmt(t)}`;
}

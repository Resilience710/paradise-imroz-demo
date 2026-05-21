import type { Room } from './data';
import { supabase, type DBBooking } from './supabase';

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export type Booking = {
  code: string;
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  fullName: string;
  email: string;
  phone: string;
  note?: string;
  status: BookingStatus;
  createdAt: string;
  decidedAt?: string;
  adminNote?: string;
};

function fromDB(row: DBBooking): Booking {
  return {
    code: row.code,
    roomSlug: row.room_slug,
    checkIn: row.check_in,
    checkOut: row.check_out,
    nights: row.nights,
    guests: row.guests,
    total: row.total,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    note: row.note || undefined,
    status: row.status,
    adminNote: row.admin_note || undefined,
    decidedAt: row.decided_at || undefined,
    createdAt: row.created_at,
  };
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'PRD-';
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function nightsBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function calcTotal(room: Room, nights: number): number {
  return room.pricePerNight * nights;
}

// === DB API ===

export async function createBooking(b: Omit<Booking, 'createdAt' | 'status'>): Promise<Booking | null> {
  const payload = {
    code: b.code,
    room_slug: b.roomSlug,
    check_in: b.checkIn.slice(0, 10),
    check_out: b.checkOut.slice(0, 10),
    nights: b.nights,
    guests: b.guests,
    total: b.total,
    full_name: b.fullName,
    email: b.email,
    phone: b.phone,
    note: b.note || null,
    status: 'pending' as const,
  };
  const { data, error } = await supabase.from('bookings').insert(payload).select().single();
  if (error || !data) {
    console.error('createBooking', error);
    return null;
  }
  return fromDB(data as DBBooking);
}

export async function getBooking(code: string): Promise<Booking | null> {
  const { data, error } = await supabase.from('bookings').select('*').eq('code', code).maybeSingle();
  if (error || !data) return null;
  return fromDB(data as DBBooking);
}

export async function listBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as DBBooking[]).map(fromDB);
}

// Admin actions — go through API route for service_role privilege
export async function updateBookingStatus(code: string, status: BookingStatus, adminNote?: string) {
  const res = await fetch('/api/admin/bookings/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, status, adminNote }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('updateBookingStatus', err);
  }
  notifyChange();
}

export async function deleteBooking(code: string) {
  const res = await fetch('/api/admin/bookings/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('deleteBooking', err);
  }
  notifyChange();
}

function notifyChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('bookings-changed'));
}

export function onBookingsChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('bookings-changed', handler);

  // Realtime: subscribe to bookings table changes
  const channel = supabase
    .channel('bookings-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => handler())
    .subscribe();

  return () => {
    window.removeEventListener('bookings-changed', handler);
    supabase.removeChannel(channel);
  };
}

export function formatDate(iso: string, lang: 'tr' | 'en'): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(iso: string, lang: 'tr' | 'en'): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatPrice(amount: number, lang: 'tr' | 'en'): string {
  return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const STATUS_LABELS: Record<BookingStatus, { tr: string; en: string; color: string }> = {
  pending: { tr: 'Onay bekliyor', en: 'Pending', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  approved: { tr: 'Onaylandı', en: 'Approved', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  rejected: { tr: 'Reddedildi', en: 'Rejected', color: 'bg-rose-100 text-rose-900 border-rose-300' },
};

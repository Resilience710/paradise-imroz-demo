import type { Room } from './data';

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

const STORAGE_KEY = 'paradise-imroz-bookings';

export function saveBooking(b: Booking) {
  if (typeof window === 'undefined') return;
  const all = listBookings();
  all.push(b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  emitChange();
}

export function getBooking(code: string): Booking | null {
  if (typeof window === 'undefined') return null;
  return listBookings().find((b) => b.code === code) || null;
}

export function listBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function updateBookingStatus(code: string, status: BookingStatus, adminNote?: string) {
  if (typeof window === 'undefined') return;
  const all = listBookings();
  const idx = all.findIndex((b) => b.code === code);
  if (idx === -1) return;
  all[idx] = {
    ...all[idx],
    status,
    decidedAt: new Date().toISOString(),
    adminNote: adminNote || all[idx].adminNote,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  emitChange();
}

export function deleteBooking(code: string) {
  if (typeof window === 'undefined') return;
  const all = listBookings().filter((b) => b.code !== code);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  emitChange();
}

function emitChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('bookings-changed'));
}

export function onBookingsChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('bookings-changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('bookings-changed', handler);
    window.removeEventListener('storage', handler);
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

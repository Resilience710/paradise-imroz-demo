import type { Room } from './data';

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
  createdAt: string;
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

export function formatDate(iso: string, lang: 'tr' | 'en'): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatPrice(amount: number, lang: 'tr' | 'en'): string {
  return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

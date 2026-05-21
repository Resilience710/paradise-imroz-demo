import { supabase } from './supabase';

export type TravelParty = 'family' | 'couple' | 'solo' | 'business' | 'friends' | null;

export type Review = {
  id: string;
  rating: number;
  guestName: string;
  traveledWith: TravelParty;
  postedDate: string;
  stayPeriod: string | null;
  bodyTitle: string | null;
  body: string | null;
  liked: string | null;
  hotelReply: string | null;
  replyDate: string | null;
  sortOrder: number;
  visible: boolean;
  createdAt: string;
};

type DBReview = {
  id: string;
  rating: number;
  guest_name: string;
  traveled_with: TravelParty;
  posted_date: string;
  stay_period: string | null;
  body_title: string | null;
  body: string | null;
  liked: string | null;
  hotel_reply: string | null;
  reply_date: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

function fromDB(r: DBReview): Review {
  return {
    id: r.id,
    rating: r.rating,
    guestName: r.guest_name,
    traveledWith: r.traveled_with,
    postedDate: r.posted_date,
    stayPeriod: r.stay_period,
    bodyTitle: r.body_title,
    body: r.body,
    liked: r.liked,
    hotelReply: r.hotel_reply,
    replyDate: r.reply_date,
    sortOrder: r.sort_order,
    visible: r.visible,
    createdAt: r.created_at,
  };
}

export async function listVisibleReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true })
    .order('posted_date', { ascending: false });
  if (error || !data) return [];
  return (data as DBReview[]).map(fromDB);
}

export async function listAllReviews(): Promise<Review[]> {
  // RLS allows only visible=true via anon; admin pages use API
  const res = await fetch('/api/admin/reviews/list', { credentials: 'include' });
  if (!res.ok) return [];
  const data = await res.json();
  return (data as DBReview[]).map(fromDB);
}

export async function upsertReview(patch: Partial<Review> & { id?: string }) {
  const res = await fetch('/api/admin/reviews/upsert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    console.error(await res.text());
    return null;
  }
  notify();
  return res.json();
}

export async function deleteReview(id: string) {
  const res = await fetch('/api/admin/reviews/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id }),
  });
  if (!res.ok) console.error(await res.text());
  notify();
}

function notify() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('reviews-changed'));
}

export function onReviewsChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('reviews-changed', handler);
  const channel = supabase
    .channel('reviews-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => handler())
    .subscribe();
  return () => {
    window.removeEventListener('reviews-changed', handler);
    supabase.removeChannel(channel);
  };
}

export function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const PARTY_LABELS: Record<NonNullable<TravelParty>, { tr: string; en: string }> = {
  family: { tr: 'Ailesiyle seyahat etti', en: 'Traveled with family' },
  couple: { tr: 'Partneriyle seyahat etti', en: 'Traveled with partner' },
  solo: { tr: 'Tek seyahat etti', en: 'Traveled solo' },
  business: { tr: 'İş seyahati', en: 'Business trip' },
  friends: { tr: 'Arkadaşlarıyla', en: 'With friends' },
};

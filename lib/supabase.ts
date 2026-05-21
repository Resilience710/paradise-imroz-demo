import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser/SSR-safe anonymous client (RLS enforced)
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

// Server-only client with full DB powers — DO NOT IMPORT FROM CLIENT COMPONENTS
export function supabaseAdmin() {
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!svc) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return createClient(url, svc, { auth: { persistSession: false } });
}

// DB row → app shape
export type DBBooking = {
  id: string;
  code: string;
  room_slug: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  total: number;
  full_name: string;
  email: string;
  phone: string;
  note: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  decided_at: string | null;
  created_at: string;
};

export type DBPhoto = {
  id: string;
  storage_path: string;
  url: string;
  alt_tr: string;
  alt_en: string;
  category: 'oda' | 'kahvalti' | 'cephe' | 'bahce' | 'manzara' | 'diger';
  sort_order: number;
  created_at: string;
};

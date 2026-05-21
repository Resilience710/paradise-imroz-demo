import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const { slug, pricePerNight, customImages } = await req.json();
  if (!slug) return NextResponse.json({ ok: false, error: 'slug required' }, { status: 400 });

  const row: Record<string, unknown> = { slug, updated_at: new Date().toISOString() };
  if (pricePerNight === null || typeof pricePerNight === 'number') row.price_per_night = pricePerNight;
  if (Array.isArray(customImages)) row.custom_images = customImages;

  const sb = supabaseAdmin();
  const { error } = await sb.from('room_settings').upsert(row, { onConflict: 'slug' });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

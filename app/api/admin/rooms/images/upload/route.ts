import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 30;

const BUCKET = 'hotel-photos';

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file');
  const slug = String(form.get('slug') || '').trim();
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: 'no file' }, { status: 400 });
  if (!slug) return NextResponse.json({ ok: false, error: 'slug required' }, { status: 400 });

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const path = `rooms/${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${safeExt}`;

  const sb = supabaseAdmin();
  const buffer = await file.arrayBuffer();
  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || `image/${safeExt}`,
    upsert: false,
  });
  if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });

  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: pub.publicUrl, path });
}

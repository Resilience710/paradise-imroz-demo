import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 30;

const BUCKET = 'hotel-photos';

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'no file' }, { status: 400 });
  }
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]+/g, '-').slice(0, 50) || 'photo';
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${baseName}.${safeExt}`;

  const sb = supabaseAdmin();
  const arrayBuffer = await file.arrayBuffer();

  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType: file.type || `image/${safeExt}`,
    upsert: false,
  });
  if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });

  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  const { data, error } = await sb
    .from('photos')
    .insert({
      storage_path: path,
      url: publicUrl,
      alt_tr: baseName,
      alt_en: baseName,
      category: 'diger',
      sort_order: 100,
    })
    .select()
    .single();
  if (error || !data) {
    // try to cleanup storage
    await sb.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ ok: false, error: error?.message || 'insert failed' }, { status: 500 });
  }
  return NextResponse.json({
    id: data.id,
    src: data.url,
    alt: { tr: data.alt_tr, en: data.alt_en },
    category: data.category,
    source: 'admin',
    sortOrder: data.sort_order,
    storagePath: data.storage_path,
  });
}

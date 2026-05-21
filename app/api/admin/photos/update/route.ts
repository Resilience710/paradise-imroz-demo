import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id, altTr, altEn, category } = await req.json();
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (typeof altTr === 'string') patch.alt_tr = altTr;
  if (typeof altEn === 'string') patch.alt_en = altEn;
  if (category && ['oda', 'kahvalti', 'cephe', 'bahce', 'manzara', 'diger'].includes(category)) patch.category = category;
  const sb = supabaseAdmin();
  const { error } = await sb.from('photos').update(patch).eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

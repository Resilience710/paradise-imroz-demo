import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const sb = supabaseAdmin();
  const { error } = await sb.from('reviews').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

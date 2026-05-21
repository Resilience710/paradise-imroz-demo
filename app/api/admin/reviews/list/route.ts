import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('reviews')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('posted_date', { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

const BUCKET = 'hotel-photos';

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id, storagePath } = await req.json();
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const sb = supabaseAdmin();
  // Don't allow deleting statics
  if (storagePath && !String(storagePath).startsWith('static/')) {
    await sb.storage.from(BUCKET).remove([storagePath]).catch(() => null);
  }
  const { error } = await sb.from('photos').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

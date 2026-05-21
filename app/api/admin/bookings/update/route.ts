import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { code, status, adminNote } = await req.json();
  if (!code || !['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'bad payload' }, { status: 400 });
  }
  const sb = supabaseAdmin();
  const { error } = await sb
    .from('bookings')
    .update({
      status,
      admin_note: adminNote || null,
      decided_at: new Date().toISOString(),
    })
    .eq('code', code);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

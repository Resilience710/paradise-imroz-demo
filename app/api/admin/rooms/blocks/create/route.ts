import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

const SOURCES = ['manual', 'hotels.com', 'booking.com', 'external', 'phone', 'walk-in'];

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const { roomSlug, from, to, source, guestName, note } = await req.json();
  if (!roomSlug || !from || !to) {
    return NextResponse.json({ ok: false, error: 'roomSlug/from/to required' }, { status: 400 });
  }
  if (new Date(to) <= new Date(from)) {
    return NextResponse.json({ ok: false, error: 'to must be after from' }, { status: 400 });
  }
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('room_blocks')
    .insert({
      room_slug: roomSlug,
      from_date: from,
      to_date: to,
      source: SOURCES.includes(source) ? source : 'manual',
      guest_name: guestName || null,
      note: note || null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

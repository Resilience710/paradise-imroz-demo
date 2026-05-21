import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthed } from '@/lib/admin-auth';

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const p = await req.json();
  const row: Record<string, unknown> = {};
  if (typeof p.rating === 'number') row.rating = p.rating;
  if (typeof p.guestName === 'string') row.guest_name = p.guestName;
  if (p.traveledWith === null || ['family', 'couple', 'solo', 'business', 'friends'].includes(p.traveledWith)) row.traveled_with = p.traveledWith || null;
  if (typeof p.postedDate === 'string') row.posted_date = p.postedDate;
  if ('stayPeriod' in p) row.stay_period = p.stayPeriod || null;
  if ('bodyTitle' in p) row.body_title = p.bodyTitle || null;
  if ('body' in p) row.body = p.body || null;
  if ('liked' in p) row.liked = p.liked || null;
  if ('hotelReply' in p) row.hotel_reply = p.hotelReply || null;
  if ('replyDate' in p) row.reply_date = p.replyDate || null;
  if (typeof p.sortOrder === 'number') row.sort_order = p.sortOrder;
  if (typeof p.visible === 'boolean') row.visible = p.visible;

  const sb = supabaseAdmin();
  if (p.id) {
    const { data, error } = await sb.from('reviews').update(row).eq('id', p.id).select().single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } else {
    // Required defaults for insert
    if (!('rating' in row) || !('guest_name' in row) || !('posted_date' in row)) {
      return NextResponse.json({ ok: false, error: 'rating, guestName, postedDate required' }, { status: 400 });
    }
    if (!('sort_order' in row)) row.sort_order = 0;
    if (!('visible' in row)) row.visible = true;
    const { data, error } = await sb.from('reviews').insert(row).select().single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }
}

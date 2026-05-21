import { NextResponse } from 'next/server';
import { isAdminAuthed } from '@/lib/admin-auth';

export async function GET() {
  return NextResponse.json({ ok: await isAdminAuthed() }, { status: (await isAdminAuthed()) ? 200 : 401 });
}

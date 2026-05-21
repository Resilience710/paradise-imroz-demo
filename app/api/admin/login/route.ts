import { NextResponse } from 'next/server';
import { sha256Hex, ADMIN_COOKIE } from '@/lib/admin-auth';

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  const hash = sha256Hex(String(password || ''));
  const expected = process.env.ADMIN_PASSWORD_HASH;
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'ADMIN_PASSWORD_HASH not set' }, { status: 500 });
  }
  if (hash !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, hash, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14, // 2 weeks
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}

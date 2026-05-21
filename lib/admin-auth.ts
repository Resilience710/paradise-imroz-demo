import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'paradise-admin';

export function sha256Hex(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const tok = store.get(COOKIE_NAME)?.value;
  if (!tok) return false;
  const expected = process.env.ADMIN_PASSWORD_HASH;
  return !!expected && tok === expected;
}

export const ADMIN_COOKIE = COOKIE_NAME;

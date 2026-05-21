'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useLang } from '@/components/lang/lang-provider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLang();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // session check via cookie (server-only). Try a tiny privileged ping.
    fetch('/api/admin/check', { credentials: 'include' })
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password: input }),
    });
    setBusy(false);
    if (res.ok) {
      setAuthed(true);
      setInput('');
    } else {
      setErr(true);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE', credentials: 'include' });
    setAuthed(false);
    router.push('/admin');
  };

  if (authed === null) {
    return <div className="pt-40 text-center text-muted">…</div>;
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 pt-24">
        <form onSubmit={submit} className="bg-cream border border-line p-8 md:p-10 w-full max-w-md">
          <div className="eyebrow">{t('Yönetim', 'Admin')}</div>
          <h1 className="font-display text-3xl mb-2">Paradise <em className="italic text-aegean">Imroz</em></h1>
          <p className="text-muted mb-6 text-sm">
            {t('Bu alan otelciye özeldir. Demo şifresi: ', 'Admin area. Demo password: ')}
            <code className="bg-ink text-cream px-2 py-0.5 text-xs">admin</code>
          </p>
          <label className="block">
            <span className="text-[0.7rem] tracking-[0.2em] uppercase text-muted">{t('Şifre', 'Password')}</span>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              className="mt-2 w-full bg-transparent border-b border-line py-2 outline-none focus:border-terracotta text-lg"
            />
          </label>
          {err && <p className="text-terracotta text-xs mt-2">{t('Şifre yanlış.', 'Wrong password.')}</p>}
          <button type="submit" disabled={busy} className="btn-terracotta w-full mt-6 disabled:opacity-50">
            {busy ? t('Giriş yapılıyor…', 'Signing in…') : t('Giriş yap', 'Sign in')}
          </button>
        </form>
      </main>
    );
  }

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`block px-4 py-3 text-sm tracking-wide transition-colors ${
          active ? 'bg-ink text-cream' : 'text-ink hover:bg-cream'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-bone">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-0">
        <aside className="border-r border-line min-h-[calc(100vh-80px)] py-8 px-4">
          <div className="px-4 mb-8">
            <div className="text-[0.65rem] tracking-[0.3em] uppercase text-muted mb-1">{t('Yönetim', 'Admin')}</div>
            <div className="font-display text-2xl">Paradise <em className="italic text-aegean">Imroz</em></div>
          </div>
          <nav className="space-y-1">
            <NavLink href="/admin" label={t('Genel bakış', 'Overview')} />
            <NavLink href="/admin/rezervasyonlar" label={t('Rezervasyonlar', 'Reservations')} />
            <NavLink href="/admin/odalar" label={t('Odalar', 'Rooms')} />
            <NavLink href="/admin/yorumlar" label={t('Yorumlar', 'Reviews')} />
            <NavLink href="/admin/galeri" label={t('Galeri', 'Gallery')} />
          </nav>
          <div className="mt-12 px-4">
            <button onClick={logout} className="text-[0.7rem] tracking-[0.2em] uppercase text-muted hover:text-terracotta">
              {t('Çıkış', 'Sign out')} →
            </button>
            <Link href="/" className="block mt-3 text-[0.7rem] tracking-[0.2em] uppercase text-muted hover:text-aegean">
              ← {t('Siteye dön', 'Back to site')}
            </Link>
          </div>
        </aside>
        <section className="p-6 md:p-10">{children}</section>
      </div>
    </div>
  );
}

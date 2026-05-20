'use client';

import { useLang } from '@/components/lang/lang-provider';

type Props = {
  eyebrow: { tr: string; en: string };
  title: { tr: React.ReactNode; en: React.ReactNode };
  lead?: { tr: string; en: string };
};

export function PageHeader({ eyebrow, title, lead }: Props) {
  const { lang, t } = useLang();
  return (
    <header className="pt-32 pb-16 px-6 md:px-10 max-w-[1400px] mx-auto">
      <div className="eyebrow">{t(eyebrow.tr, eyebrow.en)}</div>
      <h1 className="section-title">{lang === 'tr' ? title.tr : title.en}</h1>
      {lead && (
        <p className="text-[1.1rem] leading-relaxed max-w-[640px] text-muted">
          {t(lead.tr, lead.en)}
        </p>
      )}
    </header>
  );
}

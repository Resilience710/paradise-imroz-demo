'use client';

import { useEffect, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { tr, enGB } from 'date-fns/locale';
import { useLang } from '@/components/lang/lang-provider';
import type { WizardState } from './wizard';
import { nightsBetween } from '@/lib/booking';

type Props = {
  state: WizardState;
  setState: (updater: (s: WizardState) => WizardState) => void;
  onNext: () => void;
};

export function DateStep({ state, setState, onNext }: Props) {
  const { t, lang } = useLang();
  const [range, setRange] = useState<DateRange | undefined>(
    state.checkIn && state.checkOut ? { from: state.checkIn, to: state.checkOut } : undefined
  );
  const [monthCount, setMonthCount] = useState(2);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setMonthCount(mq.matches ? 2 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const nights = range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;

  const handleNext = () => {
    if (!range?.from || !range?.to) return;
    setState((s) => ({ ...s, checkIn: range.from, checkOut: range.to }));
    onNext();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-12">
      <div className="bg-cream border border-line p-4 md:p-8 overflow-x-auto">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={monthCount}
          locale={lang === 'tr' ? tr : enGB}
          weekStartsOn={1}
          disabled={{ before: today }}
          showOutsideDays={false}
        />
      </div>

      <div className="bg-cream border border-line p-5 md:p-8">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-muted mb-4">
          {t('Seçim özeti', 'Selection')}
        </div>

        <div className="mb-6">
          <div className="text-xs tracking-wider uppercase text-muted mb-1">{t('Giriş', 'Check-in')}</div>
          <div className="font-display text-2xl">
            {range?.from
              ? range.from.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : <span className="text-muted">—</span>}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs tracking-wider uppercase text-muted mb-1">{t('Çıkış', 'Check-out')}</div>
          <div className="font-display text-2xl">
            {range?.to
              ? range.to.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : <span className="text-muted">—</span>}
          </div>
        </div>

        <div className="pt-4 border-t border-line mb-6">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">{t('Toplam gece', 'Total nights')}</span>
            <span className="font-display text-xl text-aegean">{nights}</span>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!range?.from || !range?.to || nights < 1}
          className="btn-terracotta w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('Müsait odaları gör', 'See available rooms')}
        </button>
        <p className="text-xs text-muted mt-4">
          {t('Min 1 gece, max 14 gece. Bloke tarihler odaya göre değişir.', 'Min 1 night, max 14. Blocked dates vary per room.')}
        </p>
      </div>
    </div>
  );
}

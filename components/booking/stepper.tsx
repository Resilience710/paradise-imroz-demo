'use client';

import { useLang } from '@/components/lang/lang-provider';
import type { WizardState } from './wizard';

type Step = 'dates' | 'rooms' | 'guest' | 'review';

export function Stepper({
  current,
  onStep,
  state,
}: {
  current: Step;
  onStep: (s: Step) => void;
  state: WizardState;
}) {
  const { t } = useLang();
  const steps: { id: Step; label: string; can: boolean }[] = [
    { id: 'dates', label: t('1. Tarihler', '1. Dates'), can: true },
    { id: 'rooms', label: t('2. Oda', '2. Room'), can: !!state.checkIn && !!state.checkOut },
    { id: 'guest', label: t('3. Bilgiler', '3. Details'), can: !!state.roomSlug },
    { id: 'review', label: t('4. Onay', '4. Confirm'), can: !!state.roomSlug && !!state.fullName && !!state.email },
  ];

  return (
    <div className="grid grid-cols-4 border-t border-b border-line">
      {steps.map((s) => {
        const isActive = current === s.id;
        const isClickable = s.can;
        return (
          <button
            key={s.id}
            onClick={() => isClickable && onStep(s.id)}
            disabled={!isClickable}
            className={`text-left p-4 border-r border-line last:border-r-0 transition-colors ${
              isActive ? 'bg-cream' : ''
            } ${isClickable ? 'cursor-pointer hover:bg-cream' : 'opacity-50 cursor-not-allowed'}`}
          >
            <div className={`text-[0.7rem] tracking-[0.2em] uppercase ${isActive ? 'text-terracotta' : 'text-muted'}`}>
              {s.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

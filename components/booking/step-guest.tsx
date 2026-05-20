'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLang } from '@/components/lang/lang-provider';
import { rooms } from '@/lib/data';
import type { WizardState } from './wizard';

const schema = z.object({
  fullName: z.string().min(2, 'min'),
  email: z.string().email('email'),
  phone: z.string().min(7, 'phone'),
  guests: z.coerce.number().min(1).max(6),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  state: WizardState;
  setState: (updater: (s: WizardState) => WizardState) => void;
  onNext: () => void;
  onBack: () => void;
};

export function GuestStep({ state, setState, onNext, onBack }: Props) {
  const { t } = useLang();
  const room = rooms.find((r) => r.slug === state.roomSlug);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: state.fullName,
      email: state.email,
      phone: state.phone,
      guests: state.guests,
      note: state.note,
    },
  });

  const submit = (data: FormValues) => {
    setState((s) => ({
      ...s,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      note: data.note || '',
    }));
    onNext();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
      <form onSubmit={handleSubmit(submit)} className="bg-cream border border-line p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={t('Ad Soyad', 'Full name')} error={errors.fullName} full>
          <input type="text" {...register('fullName')} className="input" autoComplete="name" />
        </Field>
        <Field label="E-mail" error={errors.email}>
          <input type="email" {...register('email')} className="input" autoComplete="email" />
        </Field>
        <Field label={t('Telefon', 'Phone')} error={errors.phone}>
          <input type="tel" {...register('phone')} className="input" autoComplete="tel" />
        </Field>
        <Field label={t('Misafir sayısı', 'Number of guests')}>
          <select {...register('guests')} className="input">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </Field>
        <Field label={t('Geliş saati / not (ops.)', 'Arrival time / note (opt.)')} full>
          <textarea {...register('note')} rows={3} className="input resize-y min-h-[60px]" />
        </Field>

        <div className="sm:col-span-2 flex justify-between items-center pt-4 border-t border-line">
          <button type="button" onClick={onBack} className="text-[0.78rem] tracking-[0.15em] uppercase text-aegean hover:text-terracotta">
            ← {t('Geri', 'Back')}
          </button>
          <button type="submit" className="btn-terracotta">
            {t('Devam et', 'Continue')}
          </button>
        </div>

        <style jsx>{`
          .input {
            background: transparent;
            border: none;
            border-bottom: 1px solid #d8cfbd;
            padding: 0.5rem 0;
            color: #1a1d1a;
            font-family: var(--font-dm-sans);
            font-size: 1rem;
            outline: none;
            width: 100%;
            transition: border-color 0.2s;
          }
          .input:focus { border-color: #b65b3c; }
        `}</style>
      </form>

      <aside className="bg-ink text-cream p-6 md:p-8">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-cream/50 mb-4">
          {t('Seçiminiz', 'Your selection')}
        </div>
        {room && (
          <>
            <div className="font-display text-3xl mb-1">{t(room.name.tr, room.name.en)}</div>
            <div className="text-cream/70 text-sm mb-6">{t(room.tagline.tr, room.tagline.en)}</div>
          </>
        )}
        {state.checkIn && state.checkOut && (
          <div className="text-sm text-cream/70 leading-relaxed">
            {state.checkIn.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            {' → '}
            {state.checkOut.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}
      </aside>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  full,
}: {
  label: string;
  children: React.ReactNode;
  error?: { message?: string };
  full?: boolean;
}) {
  return (
    <div className={`flex flex-col ${full ? 'sm:col-span-2' : ''}`}>
      <label className="text-[0.7rem] tracking-[0.2em] uppercase text-muted mb-2">{label}</label>
      {children}
      {error && (
        <span className="text-terracotta text-xs mt-1">
          {error.message === 'email' ? 'Geçerli bir e-mail girin' : error.message === 'min' ? 'Lütfen doldurun' : error.message === 'phone' ? 'Geçerli bir telefon girin' : 'Hata'}
        </span>
      )}
    </div>
  );
}

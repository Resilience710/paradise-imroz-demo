'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLang } from '@/components/lang/lang-provider';
import { rooms } from '@/lib/data';
import { isRoomAvailable } from '@/lib/mock-bookings';
import { generateBookingCode, nightsBetween, calcTotal, saveBooking, type Booking } from '@/lib/booking';
import { DateStep } from './step-dates';
import { RoomStep } from './step-rooms';
import { GuestStep } from './step-guest';
import { ReviewStep } from './step-review';
import { Stepper } from './stepper';

export type WizardState = {
  checkIn?: Date;
  checkOut?: Date;
  roomSlug?: string;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  note: string;
};

type Step = 'dates' | 'rooms' | 'guest' | 'review';
const STEPS: Step[] = ['dates', 'rooms', 'guest', 'review'];

export function BookingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLang();

  const stepParam = (params.get('step') as Step) || 'dates';
  const step: Step = STEPS.includes(stepParam) ? stepParam : 'dates';

  const [state, setState] = useState<WizardState>({
    guests: 2,
    fullName: '',
    email: '',
    phone: '',
    note: '',
    roomSlug: params.get('room') || undefined,
  });

  // Load saved wizard state from sessionStorage (so steps preserve data on URL change)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem('wizard-state');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setState((s) => ({
          ...s,
          ...parsed,
          checkIn: parsed.checkIn ? new Date(parsed.checkIn) : undefined,
          checkOut: parsed.checkOut ? new Date(parsed.checkOut) : undefined,
        }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('wizard-state', JSON.stringify({
      ...state,
      checkIn: state.checkIn?.toISOString(),
      checkOut: state.checkOut?.toISOString(),
    }));
  }, [state]);

  const goTo = (s: Step) => {
    const qp = new URLSearchParams(params.toString());
    qp.set('step', s);
    router.push(`/rezervasyon?${qp.toString()}`);
  };

  const room = useMemo(() => rooms.find((r) => r.slug === state.roomSlug), [state.roomSlug]);
  const nights = state.checkIn && state.checkOut ? nightsBetween(state.checkIn, state.checkOut) : 0;
  const total = room && nights > 0 ? calcTotal(room, nights) : 0;

  const submit = () => {
    if (!room || !state.checkIn || !state.checkOut) return null;
    const code = generateBookingCode();
    const booking: Booking = {
      code,
      roomSlug: room.slug,
      checkIn: state.checkIn.toISOString(),
      checkOut: state.checkOut.toISOString(),
      nights,
      guests: state.guests,
      total,
      fullName: state.fullName,
      email: state.email,
      phone: state.phone,
      note: state.note || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    saveBooking(booking);
    sessionStorage.removeItem('wizard-state');
    router.push(`/rezervasyon/onay/${code}`);
  };

  // Guard: don't allow going forward without prerequisites
  useEffect(() => {
    if (step === 'rooms' && (!state.checkIn || !state.checkOut)) goTo('dates');
    if (step === 'guest' && !state.roomSlug) goTo('rooms');
    if (step === 'review' && (!state.roomSlug || !state.fullName || !state.email)) goTo('guest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <main className="pt-32 pb-24 max-w-[1100px] mx-auto px-6 md:px-10">
      <div className="eyebrow">{t('Rezervasyon', 'Reservation')}</div>
      <h1 className="section-title mb-12">
        {step === 'dates' && t('Tarihleri seçin', 'Choose your dates')}
        {step === 'rooms' && t('Müsait odalar', 'Available rooms')}
        {step === 'guest' && t('Misafir bilgileri', 'Guest details')}
        {step === 'review' && t('Onay', 'Confirm')}
      </h1>

      <Stepper current={step} onStep={goTo} state={state} />

      <div className="mt-12">
        {step === 'dates' && (
          <DateStep
            state={state}
            setState={setState}
            onNext={() => goTo('rooms')}
          />
        )}
        {step === 'rooms' && state.checkIn && state.checkOut && (
          <RoomStep
            checkIn={state.checkIn}
            checkOut={state.checkOut}
            selectedSlug={state.roomSlug}
            onSelect={(slug) => {
              setState((s) => ({ ...s, roomSlug: slug }));
              goTo('guest');
            }}
            onBack={() => goTo('dates')}
          />
        )}
        {step === 'guest' && room && (
          <GuestStep
            state={state}
            setState={setState}
            onNext={() => goTo('review')}
            onBack={() => goTo('rooms')}
          />
        )}
        {step === 'review' && room && state.checkIn && state.checkOut && (
          <ReviewStep
            state={state}
            nights={nights}
            total={total}
            onConfirm={submit}
            onBack={() => goTo('guest')}
          />
        )}
      </div>
    </main>
  );
}

// Helper for steps to check availability
export function getAvailableRooms(from: Date, to: Date) {
  return rooms.filter((r) => isRoomAvailable(r.slug, from, to));
}

'use client';

import { Suspense } from 'react';
import { BookingWizard } from '@/components/booking/wizard';

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-muted">…</div>}>
      <BookingWizard />
    </Suspense>
  );
}

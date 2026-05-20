export type DateRange = { from: string; to: string };

export const blockedDates: Record<string, DateRange[]> = {
  zeytin: [
    { from: '2026-06-12', to: '2026-06-16' },
    { from: '2026-07-20', to: '2026-07-25' },
  ],
  mersin: [{ from: '2026-06-01', to: '2026-06-05' }],
  lavanta: [{ from: '2026-06-20', to: '2026-06-23' }],
  defne: [{ from: '2026-08-01', to: '2026-08-15' }],
  adacayi: [],
  cam: [{ from: '2026-06-08', to: '2026-06-11' }],
  funda: [],
  mavi: [
    { from: '2026-06-15', to: '2026-06-22' },
    { from: '2026-07-01', to: '2026-07-10' },
  ],
};

export function isRoomAvailable(slug: string, from: Date, to: Date): boolean {
  const ranges = blockedDates[slug] || [];
  const checkIn = from.getTime();
  const checkOut = to.getTime();
  for (const r of ranges) {
    const blockStart = new Date(r.from).getTime();
    const blockEnd = new Date(r.to).getTime();
    if (checkIn < blockEnd && checkOut > blockStart) return false;
  }
  return true;
}

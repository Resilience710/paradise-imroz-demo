-- Room admin overrides (price, images) + manual availability blocks

-- 1) Settings override
create table if not exists public.room_settings (
  slug             text primary key,
  price_per_night  int,
  custom_images    jsonb not null default '[]'::jsonb,
  updated_at       timestamptz not null default now()
);

alter table public.room_settings enable row level security;

drop policy if exists "anyone reads room_settings" on public.room_settings;
create policy "anyone reads room_settings"
  on public.room_settings for select to anon, authenticated using (true);

-- 2) Manual blocks (Hotels.com, Booking.com, walk-in vs.)
create table if not exists public.room_blocks (
  id          uuid primary key default gen_random_uuid(),
  room_slug   text not null,
  from_date   date not null,
  to_date     date not null,
  source      text not null default 'manual',
  guest_name  text,
  note        text,
  created_at  timestamptz not null default now(),
  check (to_date > from_date)
);

create index if not exists room_blocks_room_idx  on public.room_blocks (room_slug);
create index if not exists room_blocks_dates_idx on public.room_blocks (from_date, to_date);

alter table public.room_blocks enable row level security;

drop policy if exists "anyone reads room_blocks" on public.room_blocks;
create policy "anyone reads room_blocks"
  on public.room_blocks for select to anon, authenticated using (true);

-- 3) Seed: existing mock blocked dates from lib/mock-bookings.ts
insert into public.room_blocks (room_slug, from_date, to_date, source, note) values
  ('zeytin',  '2026-06-12', '2026-06-16', 'hotels.com', 'Hotels.com aile rezervasyonu'),
  ('zeytin',  '2026-07-20', '2026-07-25', 'booking.com', 'Booking.com çift rezervasyonu'),
  ('mersin',  '2026-06-01', '2026-06-05', 'hotels.com', 'Hotels.com'),
  ('lavanta', '2026-06-20', '2026-06-23', 'booking.com', 'Booking.com'),
  ('defne',   '2026-08-01', '2026-08-15', 'hotels.com', '2 haftalık aile tatili'),
  ('cam',     '2026-06-08', '2026-06-11', 'manual',     'Telefonla rezervasyon'),
  ('mavi',    '2026-06-15', '2026-06-22', 'hotels.com', 'Hotels.com'),
  ('mavi',    '2026-07-01', '2026-07-10', 'booking.com', 'Booking.com')
on conflict do nothing;

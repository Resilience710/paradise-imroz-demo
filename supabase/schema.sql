-- Paradise Imroz — Supabase schema
-- Run with Management API or via SQL Editor

-- =========================================================
-- 1. EXTENSIONS
-- =========================================================
create extension if not exists pgcrypto;

-- =========================================================
-- 2. ENUMS
-- =========================================================
do $$ begin
  create type booking_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type photo_category as enum ('oda', 'kahvalti', 'cephe', 'bahce', 'manzara', 'diger');
exception when duplicate_object then null; end $$;

-- =========================================================
-- 3. BOOKINGS
-- =========================================================
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  room_slug   text not null,
  check_in    date not null,
  check_out   date not null,
  nights      int  not null,
  guests      int  not null,
  total       int  not null,
  full_name   text not null,
  email       text not null,
  phone       text not null,
  note        text,
  status      booking_status not null default 'pending',
  admin_note  text,
  decided_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists bookings_status_idx     on public.bookings (status);
create index if not exists bookings_room_idx       on public.bookings (room_slug);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);

alter table public.bookings enable row level security;

-- Misafir herkesin pending olarak insert etmesine izin
drop policy if exists "anyone can insert pending booking" on public.bookings;
create policy "anyone can insert pending booking"
  on public.bookings for insert to anon, authenticated
  with check (status = 'pending');

-- Herkes kendi kodu ile okuyabilsin (onay sayfası için)
drop policy if exists "anyone can read by code" on public.bookings;
create policy "anyone can read by code"
  on public.bookings for select to anon, authenticated
  using (true);

-- Sadece service_role update/delete yapar (admin panel server-side)
-- (RLS olmadığı için service_role bypass eder; ek policy gerekmez)

-- =========================================================
-- 4. PHOTOS
-- =========================================================
create table if not exists public.photos (
  id          uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url         text not null,
  alt_tr      text not null default '',
  alt_en      text not null default '',
  category    photo_category not null default 'diger',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists photos_category_idx on public.photos (category);
create index if not exists photos_sort_idx     on public.photos (sort_order);

alter table public.photos enable row level security;

-- Herkes fotoğrafları görebilir
drop policy if exists "anyone can read photos" on public.photos;
create policy "anyone can read photos"
  on public.photos for select to anon, authenticated
  using (true);

-- =========================================================
-- 5. SETTINGS (admin password gibi tek tek değerler)
-- =========================================================
create table if not exists public.settings (
  key   text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;
-- Hiçbir public read yok. Sadece service_role erişir (server route).

-- Default admin password hash (parola: "admin")
-- SHA-256 hex of "admin" = 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
insert into public.settings (key, value)
values ('admin_password_hash', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918')
on conflict (key) do nothing;

-- =========================================================
-- 6. STORAGE BUCKET
-- =========================================================
insert into storage.buckets (id, name, public)
values ('hotel-photos', 'hotel-photos', true)
on conflict (id) do nothing;

-- Public read
drop policy if exists "public read hotel photos" on storage.objects;
create policy "public read hotel photos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'hotel-photos');

-- Upload: anon kullanıcılar değil — service_role kullanır (admin server route)
-- Ekstra policy yok; service_role RLS'yi bypass eder.

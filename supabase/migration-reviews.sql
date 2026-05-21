-- Reviews table for admin-managed guest reviews
do $$ begin
  create type travel_party as enum ('family', 'couple', 'solo', 'business', 'friends');
exception when duplicate_object then null; end $$;

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  rating       int not null check (rating between 1 and 10),
  guest_name   text not null,
  traveled_with travel_party,
  posted_date  date not null,
  stay_period  text,            -- ör. "Eylül 2025 · 2 gece"
  body_title   text,
  body         text,
  liked        text,             -- virgülle ayrılmış etiketler
  hotel_reply  text,
  reply_date   date,
  sort_order   int not null default 0,
  visible      boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists reviews_visible_idx     on public.reviews (visible);
create index if not exists reviews_sort_idx        on public.reviews (sort_order);
create index if not exists reviews_posted_date_idx on public.reviews (posted_date desc);

alter table public.reviews enable row level security;

drop policy if exists "anyone can read visible reviews" on public.reviews;
create policy "anyone can read visible reviews"
  on public.reviews for select to anon, authenticated
  using (visible = true);

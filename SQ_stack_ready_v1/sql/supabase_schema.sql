
create table if not exists public.events_submissions (
  id uuid primary key default gen_random_uuid(),
  titolo text not null,
  prezzo text,
  descr text not null,
  cats text[] not null,
  contatti jsonb,
  occ jsonb not null,
  submitter jsonb not null,
  partner text,
  created_at timestamptz default now(),
  paid boolean default false,
  approved boolean default false
);

create table if not exists public.events_public (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  date date not null,
  time text,
  venue text,
  address text,
  city text,
  price text,
  lat double precision,
  lon double precision,
  created_at timestamptz default now()
);

alter table public.events_public enable row level security;
create policy if not exists "public read events" on public.events_public for select using (true);

alter table public.events_submissions enable row level security;
create policy if not exists "anon insert submissions" on public.events_submissions for insert with check (true);
create policy if not exists "no read anon submissions" on public.events_submissions for select using (false);

create index if not exists idx_events_public_date on public.events_public(date);
create index if not exists idx_events_public_city on public.events_public(city);

-- Schema for the Expectum app (local development).
-- profiles: upserted by the client (authenticated user) on sign in.
-- shared_insights: written/read via the service-role admin client (Collective Echo).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists public.shared_insights (
  id uuid primary key default gen_random_uuid(),
  question text,
  text text,
  question_count integer default 1,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Access happens through the service-role client, which bypasses RLS.
alter table public.shared_insights enable row level security;

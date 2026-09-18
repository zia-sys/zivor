-- Zivor GPT lead capture schema
-- Project: zivor GPT
-- Supabase project ref: iwmerosfwaklwqavpkqo

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  business_name text not null,
  email text not null,
  phone text,
  service text not null,
  monthly_budget text,
  message text
);

alter table public.leads enable row level security;

drop policy if exists "Anyone can submit leads" on public.leads;

create policy "Anyone can submit leads"
on public.leads
for insert
to anon, authenticated
with check (true);

-- No SELECT policy is created for anon/authenticated users,
-- so website visitors cannot read submitted leads.

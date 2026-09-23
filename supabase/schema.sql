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


-- ZIVOR user signups
create table if not exists public.signups (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.signups enable row level security;
revoke all on table public.signups from anon, authenticated;
grant select on table public.signups to authenticated;

drop policy if exists "Users can view their own signup record" on public.signups;
create policy "Users can view their own signup record"
on public.signups for select to authenticated
using ((select auth.uid()) = id);

create or replace function public.handle_new_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.signups (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

revoke execute on function public.handle_new_signup() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_zivor on auth.users;
create trigger on_auth_user_created_zivor
after insert on auth.users
for each row execute procedure public.handle_new_signup();

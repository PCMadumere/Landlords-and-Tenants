create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  phone text,
  role text not null default 'tenant'
    check (role in ('tenant', 'landlord', 'caretaker', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile only.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- Users can edit only ordinary profile fields. They receive no UPDATE privilege
-- on role, so they cannot promote themselves to admin or another role.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_profile_updated_at();

-- Create a profile automatically after Google (or another enabled provider) creates an auth user.
-- requested_role is user-supplied metadata, so it is strictly allow-listed; admin is impossible here.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen_role text;
begin
  chosen_role := coalesce(new.raw_user_meta_data ->> 'requested_role', 'tenant');
  if chosen_role not in ('tenant', 'landlord', 'caretaker') then
    chosen_role := 'tenant';
  end if;

  insert into public.profiles (id, full_name, email, avatar_url, phone, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''),
             new.raw_user_meta_data ->> 'name'),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'avatar_url',
             new.raw_user_meta_data ->> 'picture'),
    new.raw_user_meta_data ->> 'phone',
    chosen_role
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    email = coalesce(excluded.email, public.profiles.email),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

-- Do not expose the role column to client-side updates.
-- Admin assignment is a trusted manual operation in the SQL Editor only:
-- update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';


-- Backfill Auth users who existed before this migration was installed.
insert into public.profiles (id, full_name, email, avatar_url, role)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''),
           u.raw_user_meta_data ->> 'name'),
  u.email,
  coalesce(u.raw_user_meta_data ->> 'avatar_url',
           u.raw_user_meta_data ->> 'picture'),
  'tenant'
from auth.users as u
on conflict (id) do nothing;

-- =============================================================
-- UNIFIED USERS TABLE — replaces profiles + onboarding
-- =============================================================

-- 1. Drop old tables & policies
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_admin_select_all" on public.profiles;
drop policy if exists "profiles_admin_insert" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;

drop table if exists public.onboarding cascade;
drop table if exists public.profiles cascade;

drop function if exists public.create_new_user(text, text);

-- 2. Create unified users table
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  tipo_usuario text,
  datos_personales jsonb,
  beneficio_eps jsonb,
  oncosalud jsonb,
  examen_medico jsonb,
  fola jsonb,
  admin_data jsonb,
  completado boolean not null default false,
  completado_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. RLS
alter table public.users enable row level security;

-- Users can read their own row
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users for select to authenticated
  using (id = auth.uid());

-- Users can insert their own row (self-registration)
drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users for insert to authenticated
  with check (id = auth.uid());

-- Users can update their own row
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Admins can read ALL rows
drop policy if exists "users_admin_select_all" on public.users;
create policy "users_admin_select_all" on public.users for select to authenticated
  using (
    exists (select 1 from public.users p where p.id = auth.uid() and p.role = 'admin')
  );

-- Admins can update ALL rows
drop policy if exists "users_admin_update_all" on public.users;
create policy "users_admin_update_all" on public.users for update to authenticated
  using (
    exists (select 1 from public.users p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.users p where p.id = auth.uid() and p.role = 'admin')
  );

-- 4. Create users function (bypasses auth API rate limits)
create function public.create_new_user(user_email text, user_password text default '123456')
returns uuid
language plpgsql
security definer
as $$
declare
  new_user_id uuid;
  existing_count int;
begin
  select count(*) into existing_count from public.users where lower(email) = lower(user_email);
  if existing_count > 0 then
    raise exception 'duplicate_key';
  end if;

  new_user_id := gen_random_uuid();

  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, recovery_token, confirmation_token,
    raw_user_meta_data, created_at, updated_at, role, aud,
    is_super_admin, email_change, email_change_token_new, phone, phone_confirmed_at
  ) values (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(), '', '', '{}',
    now(), now(),
    'authenticated', 'authenticated',
    false, '', '', NULL, NULL
  );

  insert into public.users (id, email, role)
  values (new_user_id, user_email, 'user');

  return new_user_id;
end;
$$;

-- 5. Create admin accounts
select public.create_new_user('mat@gmail.com', '123456');
update public.users set role = 'admin' where email = 'mat@gmail.com';

select public.create_new_user('matsv@gmail.com', '123456');
update public.users set role = 'admin' where email = 'matsv@gmail.com';

-- 6. Verify
select email, role from public.users where email in ('mat@gmail.com', 'matsv@gmail.com');

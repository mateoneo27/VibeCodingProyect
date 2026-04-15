-- Fix: RLS infinite recursion on public.users
-- The admin policies were querying public.users to check the role,
-- which re-triggered the same RLS check → 500 Internal Server Error.
-- Solution: a security definer function that reads the role bypassing RLS.

-- 1. Helper function (runs as postgres, bypasses RLS)
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

-- 2. Drop the recursive policies
drop policy if exists "users_select_own"       on public.users;
drop policy if exists "users_insert_own"       on public.users;
drop policy if exists "users_update_own"       on public.users;
drop policy if exists "users_admin_select_all" on public.users;
drop policy if exists "users_admin_update_all" on public.users;

-- 3. Recreate policies using the helper (no recursion)

-- Own row — select
create policy "users_select_own" on public.users for select to authenticated
  using (id = auth.uid());

-- Own row — insert
create policy "users_insert_own" on public.users for insert to authenticated
  with check (id = auth.uid());

-- Own row — update
create policy "users_update_own" on public.users for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Admin — select all
create policy "users_admin_select_all" on public.users for select to authenticated
  using (public.get_my_role() = 'admin');

-- Admin — update all
create policy "users_admin_update_all" on public.users for update to authenticated
  using  (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

-- RLS policies for the Neo onboarding app.
-- Run this in Supabase SQL Editor, or with Supabase CLI if the project is linked.

alter table public.profiles enable row level security;
alter table public.onboarding enable row level security;

-- The frontend reads the current user's profile to know whether they are admin.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

-- Users can create/read/update their own onboarding row.
drop policy if exists "onboarding_select_own" on public.onboarding;
create policy "onboarding_select_own"
on public.onboarding
for select
to authenticated
using (id = auth.uid());

drop policy if exists "onboarding_insert_own" on public.onboarding;
create policy "onboarding_insert_own"
on public.onboarding
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "onboarding_update_own" on public.onboarding;
create policy "onboarding_update_own"
on public.onboarding
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Admins can read and update all onboarding rows from the dashboard.
drop policy if exists "onboarding_admin_select_all" on public.onboarding;
create policy "onboarding_admin_select_all"
on public.onboarding
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "onboarding_admin_update_all" on public.onboarding;
create policy "onboarding_admin_update_all"
on public.onboarding
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

-- Storage policies for the "fotos" bucket.
-- File paths are expected to be "<user_id>/fotocheck.ext".
drop policy if exists "fotos_select_own_or_admin" on storage.objects;
create policy "fotos_select_own_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'fotos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
);

drop policy if exists "fotos_insert_own_or_admin" on storage.objects;
create policy "fotos_insert_own_or_admin"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'fotos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
);

drop policy if exists "fotos_update_own_or_admin" on storage.objects;
create policy "fotos_update_own_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'fotos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
)
with check (
  bucket_id = 'fotos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
);
